const axios = require("axios");
const crypto = require('crypto');
const Url = require("url");
const moment = require('moment');

axios.interceptors.request.use(function (config) {
  if (config.headers["x-use-checksum"]) {
    const time = moment.utc().unix();
    const url = Url.parse(config.url, true);
    const secret = config.headers["x-secret"];
    const content = `${secret}\n${config.method.toUpperCase()}\n${url.pathname}\n${JSON.stringify(config.data)}\n${time}`;
    const hash = crypto
      .createHash('sha256')
      .update(content)
      .digest('hex');

    config.headers["x-checksum"] = hash;
    config.headers["x-time"] = time;
    delete config.headers["x-secret"];
    delete config.headers["x-use-checksum"];
  }

  return config;
}, function (error) {
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  const status = error.response ? Number(error.response.status) : 0;
  if (status >= 500) {
    error.canLogAxiosError = true;
  }

  return Promise.reject(error);
});
