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

};
