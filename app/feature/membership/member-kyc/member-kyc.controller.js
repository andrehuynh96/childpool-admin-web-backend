const logger = require('app/lib/logger');
const MemberKyc = require("app/model/wallet").member_kycs;
const MemberKycProperty = require("app/model/wallet").member_kyc_properties;
const KycProperty = require("app/model/wallet").kyc_properties;
module.exports = {
    getAllMemberKyc: async (req, res, next) => {
        try {
            const { query, params } = req;
            const limit = query.limit ? parseInt(query.limit) : 10;
            const offset = query.offset ? parseInt(query.offset) : 0;
            const memberWhere = {
                member_id: params.memberId,
                deleted_flg: false
            };
            const { count: total, rows: items } = await MemberKyc.findAndCountAll({
                limit,
                offset,
                include: [
                  {
                    attributes: ['id', 'member_kyc_id', 'property_id', 'field_name', 'field_key', 'value','createdAt','updatedAt'],
                    as: "MemberKycProperty",
                    model: MemberKycProperty,
                    required: true
                  },
                  {
                    attributes: ['id', 'kyc_id', 'field_name', 'field_key','description','data_type','member_field','require_flg','check_data_type_flg','order_index','enabled_flg','group_name','createdAt','updatedAt'],
                    as: "KycProperty",
                    model: KycProperty,
                    required: true
                  }
                ],
                where: memberWhere,
                order: [['created_at', 'DESC']]
            });
            return res.ok({
                items: items && items.length > 0 ? items : [],
                offset: offset,
                limit: limit,
                total: total
              });
        }
        catch (error) {
            logger.info('get list member kyc list fail', error);
            next(error);
        }
    }
};
