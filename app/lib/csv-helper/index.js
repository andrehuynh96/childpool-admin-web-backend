const _ = require('lodash');
const stringify = require('csv-stringify');

const csvHelper = {
  stringifyAsync(data, columns) {
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
  },

};


module.exports = csvHelper;
