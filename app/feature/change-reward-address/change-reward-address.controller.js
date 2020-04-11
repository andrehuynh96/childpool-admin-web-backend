const logger = require('app/lib/logger');
const StakingAPI = require("app/lib/staking-api");
const config = require('app/config');
const mailer = require('app/lib/mailer');
const User = require('app/model/wallet').users;
const UserRole = require('app/model/wallet').user_roles;
const Role = require('app/model/wallet').roles;

module.exports = {
    create: async (req, res, next) => {
        try {
            let {params: {commission_id }, body } = req;
            let include = [
                {
                    model: UserRole,
                    include: [
                        {
                        model: Role,
                        where: {
                            root_flg: true
                        }
                        },
                    ],
                }
            ];
            let user = await User.findOne({
                where: {
                    deleted_flg: false 
                },
                include: include
            })
            if (!user) {
                return res.badRequest(res.__('MASTER_NOT_FOUND'), 'MASTER_NOT_FOUND');
            }
            let data = {
                ...body,
                link: config.website.url,
                email: user.email
            }
            let result = await StakingAPI.createRewardAddressRequest(commission_id, data);
            let {platform, verify_token} = result.data;
            _sendEmail(platform, body.reward_address, user.email, verify_token);
			if (!result.code) {
				return res.ok(true);
			}
			else {
				return res.status(parseInt(result.code)).send(result.data);
			}
        } catch (error) {
            logger.error(error);
            next(error);
        }
    },
    update : async (req, res, next) => {
        try {
            let { body: {token, status}} = req;
            let data = {
                ...req.body
            }
            let result = await StakingAPI.updateRewardAddressRequest(data);
			if (!result.code) {
                let {partner, platform, address, emails} = result.data;
                if (status == 1 && emails.length > 0) {
                    _sendEmailMasterPool(partner, platform, address, emails);
                }
				return res.ok(true);
			}
			else {
				return res.status(parseInt(result.code)).send(result.data);
			}
        } catch (error) {
            logger.error(error);
            next(error);
        }
    }
}

async function _sendEmail(platform, address, email, verifyToken) {
    try {
      let subject = ` ${config.emailTemplate.partnerName} - Change reward address`;
      let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
      let data = {
        imageUrl: config.website.urlImages,
        link: `${config.website.urlConfirmRequest}${verifyToken}`,
        platform: platform,
        rewardAddress: address
      }
      data = Object.assign({}, data, config.email);
      await mailer.sendWithTemplate(subject, from, email, data, "confirm-request.ejs");
    } catch (err) {
      logger.error("send confirmed email for changing reward address for master fail", err);
    }
}

async function _sendEmailMasterPool(partner, platform, address, emails) {
    try {
      let subject = ` ${config.emailTemplate.partnerName} - Change reward address`;
      let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
      let data = {
        imageUrl: config.website.urlImages,
        link: `${config.masterWebsite.urlViewRequest}`,
        partnerName: partner,
        platform: platform,
        rewardAddress: address
      }
      data = Object.assign({}, data, config.email);
      await mailer.sendWithTemplate(subject, from, emails, data, "view-request.ejs");
    } catch (err) {
      logger.error("send confirmed email for changing reward address for master pool fail", err);
    }
}
