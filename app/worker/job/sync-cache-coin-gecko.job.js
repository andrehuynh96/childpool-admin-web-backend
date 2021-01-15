const logger = require('app/lib/logger');
const Platform = require('app/model/wallet/value-object/platform');
const CoinGecko = require('coingecko-api');
const redis = require("app/lib/redis");
const cache = redis.client();
const crypto = require('crypto');
const secret = "MS_CACHE";

module.exports = {
  execute: async () => {
    try {
      const listPlatform = Object.keys(Platform);
      const coingeckoPlatform = listPlatform.filter(platform => platform !== 'USDT');
      const coinGeckoClient = new CoinGecko();
      for (let platform of coingeckoPlatform) {
        const data = {};
        const coinPrices = await coinGeckoClient.simple.price({
          ids: [Platform[platform].coingeckoId],
          vs_currencies: ['usd'],
          include_24hr_change: true
        });
        const price = coinPrices.data[Platform[platform].coingeckoId.toLowerCase()]['usd'];
        const usd_24h_change = coinPrices.data[Platform[platform].coingeckoId.toLowerCase()].usd_24h_change;

        data.price = price;
        data.usd_24h_change = usd_24h_change;

        const keyHash = crypto.createHmac('sha256', secret)
          .update(`/coin-gecko/prices?platform=${platform}`)
          .digest('hex');
        await cache.setAsync(keyHash, JSON.stringify({ data: data }), "EX", 300);
      }
    }
    catch (error) {
      logger.error('Sync cache coin gecko price fail', error);
    }
  }
};
