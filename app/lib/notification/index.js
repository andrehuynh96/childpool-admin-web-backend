const config = require("app/config");
const logger = require("app/lib/logger");
const Notification = require('app/model/wallet').notifications;
const NotificationDetails = require('app/model/wallet').notification_details;
const Member = require('app/model/wallet').members;
const MemberSetting = require('app/model/wallet').member_settings;
const database = require('app/lib/database').db().wallet;

class NotificationService {

  constructor() { }

  async publish(notification, transaction) {
    logger.info(`Send notification "${notification.title}"`);
    const memberSettingCond = {
      is_allow_message_flg: true,
    };
    const memberList = await Member.findAll({
      include: [
        {
          as: "MemberSetting",
          model: MemberSetting,
          required: true,
          where: memberSettingCond,
        }
      ],
      where: {
        deleted_flg: false,
        // member_sts: {
        //   [Op.not]: MemberStatus.UNACTIVATED,
        // },
      }
    });

    const notificationDetailsList = memberList.map(member => {
      return {
        notification_id: notification.id,
        member_id: member.id,
        read_flg: false,
        deleted_flg: false,
      };
    });

    await NotificationDetails.bulkCreate(notificationDetailsList, { transaction });
  }

  async createNotificationMember(data, memberId) {
    let transaction;
    try {
      let config = await MemberSetting.findOne({
        where: {
          member_id: memberId,
        }
      });
      if (!config.is_allow_message_flg) {
        return;
      }

      let transaction = await database.transaction();
      let notification = await Notification.create(data, { transaction });
      await NotificationDetails.create({
        notification_id: notification.id,
        member_id: memberId,
        read_flg: false,
        deleted_flg: false
      }, { transaction });
      await transaction.commit();

      return;
    }
    catch (err) {
      if (transaction) {
        await transaction.rollBack();
      }
      logger.error('createNotificationMember failed::', err);
    }
  }

  buildNotificationContent(content, data) {
    for (let o of Object.keys(data)) {
      let pattern = `$_=${o}_$`;
      content = content.replace(pattern, data[o]);
    }
    return content;
  }
}

const notificationService = new NotificationService();

module.exports = notificationService;
