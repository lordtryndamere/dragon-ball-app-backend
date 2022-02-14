const {createConnection} = require('typeorm');
const models = require('../models')
const databaseConfig = require('./database.config')
const initializeDb = async () => {
  console.log(databaseConfig.database);
  return createConnection({
    type: databaseConfig.type ,
    database: databaseConfig.database,
    username: databaseConfig.username,
    password: databaseConfig.password,
    host: databaseConfig.host,
    port: databaseConfig.port,
    synchronize: false,
    entities: models,
    logging:false,
  });
};

module.exports =   initializeDb