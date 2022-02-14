const  { createTransport} = require ('nodemailer');
const hbs  = require('nodemailer-express-handlebars')
const path = require('path');
const fs  = require('fs')
const { appConfig } = require('../config/app');
const  { mailConfig } =require( '../config/mail');




 class Mailer {
  transport;

  constructor() {
    // eslint-disable-next-line no-console
    console.log('Sending email from:', mailConfig.user);

    this.transport = createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      secure: mailConfig.secure,
      auth: {
        user: mailConfig.user,
        pass: mailConfig.password,
      },
    });

    let templatesPath = path.resolve(
      process.cwd(),
      'src',
      'resources',
      'views'
    );

    let layoutsPath = path.resolve(
      process.cwd(),
      'src',
      'resources',
      'views',
      'layouts'
    );

    if (!fs.existsSync(templatesPath)) {
      templatesPath = path.resolve(process.cwd(), 'dist', 'resources', 'views');
    }

    if (!fs.existsSync(layoutsPath)) {
      layoutsPath = path.resolve(
        process.cwd(),
        'dist',
        'resources',
        'views',
        'layouts'
      );
    }

    this.transport.use(
      'compile',
      hbs({
        viewEngine: {
          extname: '.hbs',
          layoutsDir: layoutsPath,
        },
        viewPath: templatesPath,
        extName: '.hbs',
      })
    );
  }

  sendMail = (
    options
  ) => {
    return this.transport.sendMail({
      ...options,
      context: {
        ...options.context,
        app: {
          ...appConfig,
        },
      },
    });
  };
}


module.exports = {Mailer}