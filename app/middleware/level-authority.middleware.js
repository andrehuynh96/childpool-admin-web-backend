const Role = require('app/model/wallet').roles;
const UserRole = require('app/model/wallet').user_roles;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = function (fId, isUser = false) {
  return async function (req, res, next) {
    if (!req.session.roles) {
      return res.forbidden();
    }

    let requiredRoleIdList = [];
    let rolesControl = await _getRoleControl(req);
    let objectid = eval(fId);
    if (isUser) {
      requiredRoleIdList = await _getUserRole(objectid);
    }
    else {
      requiredRoleIdList.push(objectid);
    }

    const found = rolesControl.some(r => requiredRoleIdList.includes(r.id));
    if (found) {
      next();
    }
    else {
      res.forbidden();
    }
  };
};

async function _getRoleControl(req) {
  let levels = req.session.roles.map(ele => ele.level);
  let roleControl = [];

  for (let e of levels) {
    const roles = await Role.findAll({
      where: {
        level: { [Op.gt]: e },
        deleted_flg: false,
        root_flg: false,
      },
      order: [['level', 'ASC']]
    });

    if (roles.length > 0) {
      roleControl = roleControl.concat(roles);
    }
  }

  return roleControl;
}

async function _getUserRole(userId) {
  let userRoles = await UserRole.findAll({
    attribute: ["role_id"],
    where: {
      user_id: userId
    }
  });

  return userRoles.map(x => x.role_id);
}
