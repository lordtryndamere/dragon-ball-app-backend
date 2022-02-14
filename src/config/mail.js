 const mailConfig = {
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.MAIL_PORT) || 465,
    secure: process.env.MAIL_SECURE ? process.env.MAIL_SECURE === 'true' : true,
    user: process.env.MAIL_USER || 'iammaindiana@gmail.com',
    password: process.env.MAIL_PASSWORD || 'madara20',
  };
  module.exports = {mailConfig}