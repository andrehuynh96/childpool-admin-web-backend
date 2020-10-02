const { forEach } = require('p-iteration');
const Member = require('app/model/wallet').members;
const MemberSetting = require('app/model/wallet').member_settings;

module.exports = async () => {
  const members = await Member.findAll({
    include: [
      {
        as: "MemberSetting",
        model: MemberSetting,
        required: false,
      }
    ],
    order: [['created_at', 'ASC']]
  });

  await forEach(members, async member => {
    if (!member.MemberSetting) {
      await MemberSetting.create({
        member_id: member.id,
        is_receiced_system_notification_flg: true,
        is_receiced_activity_notification_flg: true,
        is_receiced_news_notification_flg: true,
        is_receiced_marketing_notification_flg: true,
        is_allow_message_flg: true,
      });
    }
  });

};
