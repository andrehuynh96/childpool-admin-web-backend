const logger = require("app/lib/logger");
const userRole = require("app/model/wallet").user_roles;
const RolePermission = require("app/model/wallet").role_permissions;
const Permission = require("app/model/wallet").permissions;
module.exports = {
    getAll: async (req, res, next) => {
        try {
            let limit = req.query.limit ? parseInt(req.query.limit) : 10;
            let offset = req.query.offset ? parseInt(req.query.offset) : 0;
            const { count: total, rows: items } = await Permission.findAndCountAll({ limit, offset, order: [['created_at', 'ASC']] });
            return res.ok({
                items: items && items.length > 0 ? items : [],
                offset: offset,
                limit: limit,
                total: total
            });
        }
        catch (err) {
            logger.error("get list permission fail:", err);
            next(err);
        }
    },
    get: async (req, res, next) => {
        try {
            let limit = req.query.limit ? parseInt(req.query.limit) : 10;
            let offset = req.query.offset ? parseInt(req.query.offset) : 0;
            let user = req.session.user;
            let roles = await userRole.findAll({
                attributes: ['role_id'],
                where: {
                    user_id: user.id
                }
            });
            let roleList = roles.map(role => role.role_id);
            let rolePermissions = await RolePermission.findAll({
                attributes: [
                    "permission_id"
                ],
                where: {
                    role_id: roleList
                }
            });
            rolePermissions = [...new Set(rolePermissions.map(ele => ele.permission_id))];
            let where = {
                id: rolePermissions
            };
            const { count: total, rows: items } = await Permission.findAndCountAll({ limit, offset, where: where, order: [['created_at', 'ASC']] });
            return res.ok({
                items: items && items.length > 0 ? items : [],
                offset: offset,
                limit: limit,
                total: total
            });
        }
        catch (err) {
            logger.error("get list permission of role fail:", err);
            next(err);
        }
    }
};