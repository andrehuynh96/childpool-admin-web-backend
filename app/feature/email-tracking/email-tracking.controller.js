const logger = require('app/lib/logger');
const EmailLogging = require('app/model/wallet').email_loggings;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Status = require('app/model/wallet/value-object/email-logging-status');

const pixelBytes = new Buffer(35);
pixelBytes.write("R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=", "base64");

module.exports = {
  view: async (req, res) => {
    try {
      const { params } = req;
      const emailLogging = await EmailLogging.findOne({
        where: {
          id: params.id,
        }
      });

      if (emailLogging) {
        await EmailLogging.update(
          { num_of_views: emailLogging.num_of_views + 1 },
          {
            where: {
              id: emailLogging.id,
            },
          }
        );
      }

    }
    catch (error) {
      logger.error('get email template detail fail', error);
    }

    // Disable browser caching
    res.setHeader('Surrogate-Control', 'no-store');
    res.setHeader('Cache-Control', 'private, no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Always send a 200 with the 1x1 pixel
    res.send(pixelBytes, { 'Content-Type': 'image/gif' }, 200);
  },
  search: async (req,res,next) => {
    try {
      const { query } = req;
      const limit = query.limit ? parseInt(query.limit) : 10;
      const offset = query.offset ? parseInt(query.offset) : 0;
      const where = {};

      if (query.email) {
        where.email = { [Op.iLike]: `%${query.email}%` };
      }

      if (query.status) {
        where.status = { [Op.iLike]: `${query.status}` };
      }
      const { count: total, rows: items } = await EmailLogging.findAndCountAll({
        limit,
        offset,
        where: where,
        order: [['created_at','DESC']],
        raw: true
      });
      items.forEach(item => {
        item.read_flg = item.num_of_views > 0;
        item.status = item.status.toUpperCase();
      });
      return res.ok({
        items: items,
        limit: limit,
        offset: offset,
        total: total
      });
    }
    catch (error) {
      logger.error('search list email tracking fail',error);
      next(error);
    }
  },
  details: async (req,res,next) => {
    try {
      const emailTrackingId = req.params.id;
      const emailTracking = await EmailLogging.findOne({
        where: {
          id: emailTrackingId
        }
      });
      if (!emailTracking) {
        return res.notFound(res.__("EMAIL_TRACKING_NOT_FOUND"),"EMAIL_TRACKING_NOT_FOUND",{ field: emailTrackingId });
      }
      emailTracking.read_flg = emailTracking.num_of_views > 0;
      return res.ok(emailTracking);
    }
    catch (error) {
      logger.error('get email tracking detail fail',error);
      next(error);
    }
  },
  getStatuses: async (req,res,next) => {
    try {
      const dropdownListStatus = Object.entries(Status).map(item => {
        return {
          label: item[0],
          value: item[1]
        };
      });
      return res.ok(dropdownListStatus);
    }
    catch (error) {
      logger.error('get email tracking statuses fail',error);
      next(error);
    }
  }
};
