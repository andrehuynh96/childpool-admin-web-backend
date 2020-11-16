const logger = require('app/lib/logger');
const NexoMember = require("app/model/wallet").nexo_members;
const stringify = require('csv-stringify');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');

module.exports = {
  search: async(req,res,next) => {
    try {
      const { query } = req;
      const limit = query.limit ? parseInt(req.query.limit) : 10;
      const offset = query.offset ? parseInt(req.query.offset) : 0;
      const where = {};

      if (query.first_name) {
        where.first_name = { [Op.iLike]: `%${query.first_name}%` };
      }
      if (query.last_name) {
        where.last_name = { [Op.iLike]: `%${query.last_name}%` };
      }

      if (query.email) {
        where.email = { [Op.iLike]: `%${query.email}%` };
      }

      const { count: total, rows: items } = await NexoMember.findAndCountAll({
        limit,
        offset,
        where: where,
        order: [['created_at','DESC']]
      });

      return res.ok({
        items: items,
        offset: offset,
        limit: limit,
        total: total
      });
    }
    catch (error) {
      logger.error('search nexo member fail',error);
      next(error);
    }
  },
  downloadCSV: async(req,res,next) => {
    try {
      const { query } = req;
      const where = {};

      if (query.first_name) {
        where.first_name = { [Op.iLike]: `%${query.first_name}%` };
      }
      if (query.last_name) {
        where.last_name = { [Op.iLike]: `%${query.last_name}%` };
      }

      if (query.email) {
        where.email = { [Op.iLike]: `%${query.email}%` };
      }

      const { rows: items } = await NexoMember.findAndCountAll({
        where: where,
        order: [['created_at','DESC']]
      });

      const timezone_offset = query.timezone_offset || 0;
      items.forEach(item => {
        item.created_at = moment(item.created_at).add(- timezone_offset, 'minutes').format('YYYY-MM-DD HH:mm');
      });

      const data = await stringifyAsync(items, [
        { key: 'email', header: 'Email' },
        { key: 'last_name', header: 'Last Name' },
        { key: 'first_name', header: 'First Name' },
        { key: 'status', header: 'Status' },
        { key: 'created_at', header: 'Date' },
      ]);
      res.setHeader('Content-disposition', 'attachment; filename=nexo-members.csv');
      res.set('Content-Type', 'text/csv');
      res.send(data);

    } catch (error) {
      logger.error('export nexo members fail',error);
      next(error);
    }
  }
};

function stringifyAsync(data, columns) {
  return new Promise(function (resolve, reject) {
    stringify(data, {
      header: true,
      columns: columns
    }, function (err, data) {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    }
    );
  });
}
