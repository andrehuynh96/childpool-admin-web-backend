const mailer = require('app/lib/mailer');
const config = require('app/config');
const Roles = require('app/model/wallet').roles;
const User = require("app/model/wallet").users;
const UserRole = require("app/model/wallet").user_roles;
const PermissionKey = require('app/model/wallet/value-object/permission-key');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
// const Permission = require("app/model/wallet").permissions;

class SyncCurrencyChangellyServices {
  constructor() {
  }

  async sendMail(data) {
    const adminRole = await Roles.findOne({
      where: {
        name: {
          [Op.in]: PermissionKey.RECEIVE_EMAIL_UPDATE_EXCHANGE.ROLES
        }
      }
    });

    const userRoles = await UserRole.findAll({
      where: {
        role_id: adminRole.id
      },
      include: [{
        model: User,
        attributes: ['email'],
        as: "user"
      }]
    });
    const emailAdminLists = userRoles.map(item => item.user.email);

    let subject = ` ${config.emailTemplate.partnerName} - API Changelly update`;
    let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
    if (data.fix_rate_flg === undefined) data.fix_rate_flg = '#';
    if (data.status === undefined) data.status = '#';
    data = { ...data, imageUrl: config.website.urlImages };
    await mailer.sendWithTemplate(subject, from, emailAdminLists.join(','), data, config.emailTemplate.apiChangellyUpdate);
  }
}
module.exports = SyncCurrencyChangellyServices;
