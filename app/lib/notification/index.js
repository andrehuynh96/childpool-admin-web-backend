const config = require("app/config");
const logger = require("app/lib/logger");
const NotificationDetails = require('app/model/wallet').notification_details;
const Member = require('app/model/wallet').members;
const MemberSetting = require('app/model/wallet').member_settings;
const MemberStatus = require("app/model/wallet/value-object/member-status");
const NotificationType = require("app/model/wallet/value-object/notification-type");

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

}

const notificationService = new NotificationService();

module.exports = notificationService;
