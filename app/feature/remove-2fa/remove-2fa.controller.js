const logger = require('app/lib/logger');
const Member = require("app/model/wallet").members;

module.exports = async (req, res, next) => {
  try {
    const { params } = req;
    let [_, response] = await Member.update({
      twofa_enable_flg: false
    }, {
      where: {
        id: params.memberId,
      },
      returning: true
    });
    if (!response || response.length == 0) {
      res.notFound('Not Found');
    }
    return res.ok(true);
  }
  catch (err) {
    logger.error("login fail: ", err);
    next(err);
  }
};
