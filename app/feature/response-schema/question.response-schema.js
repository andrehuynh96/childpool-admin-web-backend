const objectMapper = require('object-mapper');

const destObject = {
  array: {
    '[].id': '[].id',
    '[].title': '[].title',
    '[].title_ja': '[].title_ja?',
    '[].question_type': '[].question_type',
    '[].category_type': '[].category_type',
    '[].points': '[].points',
    '[].forecast_key': '[].forecast_key?',
    '[].actived_flg': '[].actived_flg',
    '[].deleted_flg': '[].deleted_flg',
    '[].sub_type': '[].sub_type',
    '[].Answers': '[].Answers?',
    '[].createdAt': '[].created_at',
    '[].updatedAt': '[].updated_at',
  },
  single: {
    id: 'id',
    title: 'title',
    title_ja: 'title_ja?',
    question_type: 'question_type',
    category_type: 'category_type',
    points: 'points',
    forecast_key: 'forecast_key?',
    actived_flg: 'actived_flg',
    Answers: 'answers?',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
};

module.exports = srcObject => {
  if (Array.isArray(srcObject)) {
    return srcObject.length ? objectMapper(srcObject, destObject.array) : [];
  }

  return objectMapper(srcObject, destObject.single);
};
