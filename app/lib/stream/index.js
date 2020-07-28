const toArray = require('stream-to-array');
const parse = require('csv-parse/lib/sync');
module.exports = {
   readFileCSV : async(fileData) => {
    const buffers = await toArray(fileData)
    .then(function (parts) {
      var buffers = [];
      for (var i = 0, l = parts.length; i < l; ++i) {
        var part = parts[i];
        buffers.push((part instanceof Buffer) ? part : new Buffer(part));
      }
      return Buffer.concat(buffers);
    });

    const records = parse(buffers.toString(), {
      columns: true,
      skip_empty_lines: true
    });
    return records;
   } 
};
