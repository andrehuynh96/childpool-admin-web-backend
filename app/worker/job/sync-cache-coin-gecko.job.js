const logger = require('app/lib/logger');
const Platform = require('app/model/wallet/value-object/platform');
const CoinGecko = require('coingecko-api');
const redis = require("app/lib/redis");
const cache = redis.client();
const crypto = require('crypto');
const sleep = require('sleep-promise');
const secret = "MS_CACHE";

module.exports = {
  execute: async () => {
    try {
      const listPlatform = Object.keys(Platform);
      const coingeckoPlatform = listPlatform.filter(platform => platform !== 'USDT');
      const coinGeckoClient = new CoinGecko();
      for (let platform of coingeckoPlatform) {
        try {
          const getCoinPriceResult = await coinGeckoClient.simple.price({
            ids: [Platform[platform].coingeckoId],
            vs_currencies: ['usd'],
            include_24hr_change: true
          });

          if (getCoinPriceResult.success) {
            const coinPriceData = getCoinPriceResult.data;
            const priceData = coinPriceData[Platform[platform].coingeckoId.toLowerCase()];
            if (!priceData.usd) {
              continue;
            }

            const data = {
              platform: platform,
              price: priceData.usd,
              usd_24h_change: priceData.usd_24h_change,
            };
            const keyHash = crypto.createHmac('sha256', secret)
              .update(`/coin-gecko/prices?platform=${platform}`)
              .digest('hex');
            await cache.setAsync(keyHash, JSON.stringify({ data: data }), "EX", 300);
          }
        } catch (error2) {
          logger.error(`Get gecko price for ${platform} fail`, error2);
        }

        await sleep(1000);
      }
    }
    catch (error) {
      logger.error('Sync cache coin gecko price fail', error);
    }
  }
};
