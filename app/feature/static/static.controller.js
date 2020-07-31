const s3 = require('app/service/s3.service');
const path = require('path');
const config = require('app/config');

module.exports = {
  image: async (req, res, next) => {
    try {
      let folder = req.params.folder;
      let file = path.parse(req.params.file);
      if (config.CDN.exts.indexOf(file.ext.toLowerCase()) == -1) {
        return res.notfound();
      }
      let key = `${folder}/${req.params.file}`;
      let data = await s3.get(key, next);
      res.writeHead(200, { 'Content-Type': `image/${file.ext.toLowerCase().substring(1)}` });
      res.write(data.Body, 'binary');
      res.end(null, 'binary');
    }
    catch (err) {
      console.log(err);
      next(err);
    }
  }
};