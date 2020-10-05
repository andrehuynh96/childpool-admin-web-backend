const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
  getUrlTxid(txid, currencySymbol) {
    if (!txid || txid.length < 2)
      return txid;

    let origin = txid[0] == '0' && txid[1] == 'x' ? txid.replace(/0x/g, '') : txid;
    switch (currencySymbol) {
      case 'BTC':
        return `https://www.blockchain.com/btc/tx/${origin}`;
      case 'BCH':
        return `https://www.blockchain.com/bch/tx/${origin}`;
      case 'ETH':
        return `https://www.blockchain.com/eth/tx/0x${origin}`;
      case 'USDT':
        return `https://etherscan.io/token/0x${origin}`;
      default:
        return txid;
    }
  },
  getFilterPlatform(platform) {
    if (platform === 'TADA' || platform === 'ADA') {
      return {
        [Op.in]: ['TADA', 'ADA']
      };
    }

    return platform;
  },
};
