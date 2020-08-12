const _ = require('lodash');

const stringHelper = {
  padDigits(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
  },
  createMarkup(content) {
    const html = _.escape(content);

    return html;
  },
  createMarkupWithNewLine(content) {
    const html = _.escape(content).replace(/\n/g, '<br />');

    return html;
  },

};


module.exports = stringHelper;
