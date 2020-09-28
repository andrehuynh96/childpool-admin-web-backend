const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].title': '[].title',
    '[].content': '[].content',
    '[].type': '[].type',
    '[].event': '[].event',
    '[].sent_all_flg': '[].sent_all_flg',
    '[].actived_flg': '[].actived_flg',
    '[].createdAt': '[].created_at',
    '[].updatedAt': '[].updated_at',
  },
  single: {
    id: 'id',
    title: 'title',
    content: 'content',
    type: 'type',
    event: 'event',
    sent_all_flg: 'sent_all_flg',
    actived_flg: 'actived_flg',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
};

module.exports = srcObject => {
  if (Array.isArray(srcObject)) {
    if (!srcObject || srcObject.length === 0) {
      return [];
    }

    return objectMapper(srcObject, destObject.array);
  }
  else {
    return objectMapper(srcObject, destObject.single);
  }
};
