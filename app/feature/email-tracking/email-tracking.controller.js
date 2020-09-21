const logger = require('app/lib/logger');
const EmailLogging = require('app/model/wallet').email_loggings;

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

      // Always send a 200 with the 1x1 pixel
      res.send(pixelBytes, { 'Content-Type': 'image/gif' }, 200);
    }
    catch (error) {
      logger.error('get email template detail fail', error);
      res.send(pixelBytes, { 'Content-Type': 'image/gif' }, 200);
    }
  },

};
