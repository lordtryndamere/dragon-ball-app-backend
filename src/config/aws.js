 const awsConfig = {
    region: process.env.AWS_REGION,
    smsType: process.env.AWS_SMS_TYPE,
    version: process.env.AWS_VERSION,
    phoneNumber: process.env.AWS_DEFAULT_PHONE_NUMBER,
  };
  module.exports = {awsConfig}
    