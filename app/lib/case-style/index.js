const snakeCase = require('lodash.snakecase');
const camelCase = require('lodash.camelcase');
const kebabCase = require('lodash.kebabcase');
const upperFirst = require('lodash.upperfirst');
const flow = require('lodash.flow');

const convertCase = (oldObject, converterFunction) => {
  let newObject;

  if (
    !oldObject ||
    typeof oldObject !== 'object' ||
    !Object.keys(oldObject).length
  ) {
    return oldObject;
  }

  if (Array.isArray(oldObject)) {
    newObject = oldObject.map(element =>
      convertCase(element, converterFunction)
    );
  } else {
    newObject = {};
    Object.keys(oldObject).forEach(oldKey => {
      const newKey = converterFunction(oldKey);
      if (oldKey != '_id' && oldKey != 'id') {
        newObject[newKey] = convertCase(oldObject[oldKey], converterFunction);
      } else {
        newObject[newKey] = oldObject[oldKey];
      }
    });
  }

  return newObject;
};

const toCamelCase = obj => convertCase(obj, camelCase);
const toSnakeCase = obj => convertCase(obj, snakeCase);
const toKebabCase = obj => convertCase(obj, kebabCase);
const toPascalCase = obj => convertCase(obj, flow(camelCase, upperFirst));

module.exports = {
  toCamelCase: toCamelCase,
  toSnakeCase: toSnakeCase,
  toKebabCase: toKebabCase,
  toPascalCase: toPascalCase,
};
