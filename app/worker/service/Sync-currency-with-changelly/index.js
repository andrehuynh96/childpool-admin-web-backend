const mailer = require('app/lib/mailer');
const config = require('app/config');
const Roles = require('app/model/wallet').roles;
const User = require("app/model/wallet").users;
const UserRole = require("app/model/wallet").user_roles;
const Permission = require("app/model/wallet").permissions;
const RolePermission = require("app/model/wallet").role_permissions;

const PermissionKey = require('app/model/wallet/value-object/permission-key');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
// const Permission = require("app/model/wallet").permissions;

class SyncCurrencyChangellyServices {
  constructor() {
  }

  async sendMail(data, updateExchange = true) {
    let permission = await Permission.findOne({
      where: {
        name: PermissionKey.RECEIVE_EMAIL_UPDATE_EXCHANGE.KEY
      }
    });

    const rolePermission = await RolePermission.findAll({
      where: {
        permission_id: permission.id
      }
    });

    let ids = rolePermission.map(x => x.role_id);

    const userRoles = await UserRole.findAll({
      where: {
        role_id: ids
      },
      include: [{
        model: User,
        attributes: ['email'],
        as: "user"
      }]
    });

    const emailAdminLists = userRoles.map(item => item.user.email);

    let subject = updateExchange ? ` ${config.emailTemplate.partnerName} - Update Exchange Currency` : `${config.emailTemplate.partnerName} - API Changelly update`;
    let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;

      data = { data, imageUrl: config.website.urlImages };
      await mailer.sendWithTemplate(subject, from, emailAdminLists.join(','), data, (updateExchange ? config.emailTemplate.updateExchangeCurrency : config.emailTemplate.apiChangellyUpdate));
  }
}
module.exports = SyncCurrencyChangellyServices;
