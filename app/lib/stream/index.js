const toArray = require('stream-to-array');
const parse = require('csv-parse/lib/sync');
module.exports = {
   readFileCSV : async(fileData) => {
    const arrBuffers = await toArray(fileData);
    const buf = [];
    arrBuffers.forEach(item => {
      buf.push((item instanceof Buffer) ? item : new Buffer(item));
    });
    const buffers = Buffer.concat(buf);
    const records = parse(buffers, {
      columns: true,
      skip_empty_lines: true,
      bom: true,
      trim: true
    });
    return records;
   }
};
