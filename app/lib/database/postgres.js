const config = require('app/config');
const Sequelize = require('sequelize');

let dbs = [];
let numberDb = 0;

module.exports = {
  init: async (callback) => {
    let num = 0;
    let start = async (db) => {
      try {
        await db.authenticate();
        console.log('Connection has been established successfully.');
        num++;
        if (num === numberDb) {
          callback();
        }
      } catch (err) {
        callback(err);
      }
    };
    let dbNames = Object.keys(config.db);
    numberDb = dbNames.length;
    dbNames.forEach(async (dbName) => {
      dbs[dbName] = new Sequelize(
        config.db[dbName].database,
        config.db[dbName].username,
        config.db[dbName].password,
        config.db[dbName].options
      );
      await start(dbs[dbName]);
    });
  },
  Sequelize: Sequelize,
  db() {
    return {
      ...dbs
    }
  }
}