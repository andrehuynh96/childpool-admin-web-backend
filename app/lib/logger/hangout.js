const config = require("app/config");
const axios = require('axios');

module.exports = {
  write: async (message) => {
    try {
      if (config.hangoutAlertChannel) {
        return await axios.post(config.hangoutAlertChannel, {
          "cards": [
            {
              "sections": [
                {
                  "widgets": [
                    {
                      "textParagraph": {
                        "text": message
                      }
                    }
                  ]
                }
              ]
            }
          ]
        });
      }
      return null;
    }
    catch (err) {
      return null;
    }
  }
}