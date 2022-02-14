 const appConfig = {
    name: process.env.NAME,
    shortName: process.env.SHORT_NAME,
    multipleLogin: process.env.MULTIPLE_LOGIN === 'true',
    secret: process.env.SECRET_KEY,
  };
  module.exports = {appConfig}
  