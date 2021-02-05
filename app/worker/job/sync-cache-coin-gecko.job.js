const logger = require('app/lib/logger');
const Platform = require('app/model/wallet/value-object/platform');
const CoinGecko = require('coingecko-api');
const redis = require("app/lib/redis");
const cache = redis.client();
const crypto = require('crypto');
const sleep = require('sleep-promise');
const { forEach } = require('p-iteration');

const secret = "MS_CACHE";

module.exports = {
  execute: async () => {
    try {
      const platformList = Object.keys(Platform);
      const coingeckoPlatform = platformList.filter(platform => platform !== 'USDT');
      const platformCache = {};
      const coingeckoIdList = coingeckoPlatform.map(platform => {
        const id = Platform[platform].coingeckoId;
        platformCache[id] = platform;

        return id;
      });
      const coinGeckoClient = new CoinGecko();
      let numOfRetries = 0;

      while (numOfRetries < 3) {
        try {
          const getCoinPriceResult = await coinGeckoClient.simple.price({
            ids: coingeckoIdList,
            vs_currencies: ['usd'],
            include_24hr_change: true
          });

          if (getCoinPriceResult.success) {
            const coinPriceData = getCoinPriceResult.data;

            await forEach(coingeckoIdList, async (coingeckoId) => {
              const platform = platformCache[coingeckoId];
              const priceData = coinPriceData[coingeckoId];
              if (!platform || !priceData) {
                return;
              }

              const data = {
                platform: platform,
                price: priceData.usd,
                usd_24h_change: priceData.usd_24h_change,
              };
              const keyHash = crypto.createHmac('sha256', secret)
                .update(`/coin-gecko/prices?platform=${platform}`)
                .digest('hex');
              console.log("platform ~ keyHash", platform, keyHash);

              await cache.setAsync(keyHash, JSON.stringify({ data: data }), "EX", 300);
            });
          }
        } catch (error2) {
          numOfRetries++;
          if (numOfRetries > 3) {
            throw error2;
          }

          logger.info(`Get gecko price fail`, error2);
          await sleep(1000);
        }
      }
    }
    catch (error) {
      logger.error('Sync cache coin gecko price fail', error);
    }
  }
};
