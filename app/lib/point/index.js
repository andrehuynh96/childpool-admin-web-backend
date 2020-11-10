const logger = require('app/lib/logger');
const config = require('app/config');
const PointHistory = require('app/model/wallet').point_histories;
const MembershipType = require('app/model/wallet').membership_types;
const PointStatus = require("app/model/wallet/value-object/point-status");
const PointAction = require("app/model/wallet/value-object/point-action");
const Setting = require('app/model/wallet').settings;
const Member = require('app/model/wallet').members;
const EmailTemplate = require('app/model/wallet').email_templates;
const NotificationService = require('app/lib/notification');
const EmailTemplateType = require('app/model/wallet/value-object/email-template-type')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const database = require('app/lib/database').db().wallet;

module.exports = {
  upgradeMembership: async ({ member_id, membership_type_id }) => {
    let transaction;
    try {
      let history = await PointHistory.findOne({
        where: {
          member_id: member_id,
          action: PointAction.UPGRADE_MEMBERSHIP,
          object_id: membership_type_id,
          status: {
            [Op.ne]: PointStatus.CANCELED
          }
        }
      });
      if (history) {
        return;
      }

      let setting = await Setting.findOne({
        where: {
          key: config.setting.MS_POINT_UPGRADING_MEMBERSHIP_IS_ENABLED
        }
      });
      if (!setting || Boolean(setting.value) == false) {
        return;
      }

      let membershipType = await MembershipType.findOne({
        where: {
          id: membership_type_id,
          deleted_flg: false
        }
      });
      if (!membershipType) {
        return;
      }

      transaction = await database.transaction();
      await PointHistory.create({
        member_id: member_id,
        amount: membershipType.upgrade_membership_points || 0,
        currency_symbol: "MS_POINT",
        status: PointStatus.APPROVED,
        action: PointAction.UPGRADE_MEMBERSHIP,
        object_id: membership_type_id,
      }, transaction);

      await Member.increment({
        points: parseInt(membershipType.upgrade_membership_points || 0)
      }, {
        where: {
          id: member_id
        },
        transaction
      })
      transaction.commit();

      _sendNotification({
        member_id: member_id,
        amount: 0,
        platform: '',
        point: membershipType.upgrade_membership_points,
        tx_id: '',
        template_name: EmailTemplateType.MS_POINT_NOTIFICATION_ADD_POINT_UPGRADE_MEMBERSHIP,
        membership_type: membershipType.name
      });

      return;
    }
    catch (err) {
      logger.error('add point upgradeMembership failed::', err);
      if (transaction) {
        transaction.rollback();
      }
    }
  }
}



async function _sendNotification({ member_id, point, platform, tx_id, amount, membership_type, template_name }) {
  try {
    let member = await Member.findOne({
      where: {
        id: member_id
      }
    });

    let data = {
      sent_all_flg: false,
      actived_flg: true,
      deleted_flg: false
    };

    let templates = await _findEmailTemplate(template_name);
    for (let t of templates) {
      let content = NotificationService.buildNotificationContent(t.template, {
        firstName: member.first_name,
        lastName: member.last_name,
        point: point,
        point_unit: 'points',
        amount: amount,
        platform: platform,
        tx_id: tx_id,
        membership_type: membership_type
      });
      if (t.language.toLowerCase() == 'ja') {
        data.title_ja = t.subject;
        data.content_ja = content;
      }
      else {
        data.title = t.subject;
        data.content = content;
      }
    }

    await NotificationService.createNotificationMember(data, member_id);
  }
  catch (err) {
    logger.error(`point tracking _sendNotification::`, err);
  }
}

async function _findEmailTemplate(templateName) {
  let templates = await EmailTemplate.findAll({
    where: {
      name: templateName
    }
  });

  return templates;
} 