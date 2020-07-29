const objectMapper = require('object-mapper');
const config = require("app/config");

const destObject = {
  array: {
    '[].id': '[].id',
    '[].field_name': '[].field_name',
    '[].field_key': '[].field_key',
    '[].value': '[].value',
    '[].note': '[].note',
    '[].createdAt': '[].created_at',
    '[].updatedAt': '[].updated_at'
  },
  single: {
    id: 'id',
    field_name: 'field_name',
    field_key: 'field_key',
    note: 'note',
    "value": {
      "key": "value",
      "transform": (val) => {
        if (val && val.startsWith("http")) {
          for (let i of config.aws.bucketUrls) {
            if (val.indexOf(i) > -1) {
              val = val.replace(i, config.website.url + "/web/static/images");
              break;
            }
          }
        }
        return val;
      }
    },
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
};

module.exports = srcObject => {
  if (Array.isArray(srcObject)) {
    if (srcObject === undefined || srcObject.length == 0) {
      return [];
    } else {
      let result = objectMapper(srcObject, destObject.array);
      result.forEach(e => {
        if (e.value && e.value.startsWith("http")) {
          for (let i of config.aws.bucketUrls) {
            if (e.value.indexOf(i) > -1) {
              e.value = e.value.replace(i, config.website.url + "/web/static/images");
              break;
            }
          }
        }
      });
      return result;
    }
  }
  else {
    return objectMapper(srcObject, destObject.single);
  }
}; 