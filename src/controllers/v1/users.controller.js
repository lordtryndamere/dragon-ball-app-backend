
const { getRepository } = require('typeorm');
const sha1 = require('crypto-js/sha1');
const { mailConfig } = require('../../config/mail');
const { appConfig } = require('../../config/app');
const { generateAuthToken, TokenTool, generateAccessToken } = require('../../tools/token');
const { createErrorResponse, createResponse, controllerResponse } = require('../../tools/response')
const tokenLibrary = new TokenTool();
const { AwsLib } = require('../../tools/aws')
const awsInstance = new AwsLib();
const { Mailer } = require('../../tools/mailer');
const mailer = new Mailer();
const generateCode = () => Math.floor(1000 + Math.random() * 9000);
class UserController {
  getAccessToken = (req, res) => {
    const accessToken = generateAccessToken();

    return controllerResponse(
      createResponse({
        data: {
          accessToken,
        },
        message: 'Token de acceso generado correctamente!',
      }),
      res
    );
  };

  login = async (req, res) => {
    try {
      const { body } = req;
      const userRepository = getRepository('User');
      const user = (await userRepository.findOne({
        where: {
          email: body.email,
        },
      }));
      if (!user) {
        return controllerResponse(createErrorResponse({
          httpStatusCode: 404,
          message: 'Usuario no encontrado',
        }), res);
      }
      if (user.state !== 'active') {
        return controllerResponse(createErrorResponse({
          httpStatusCode: 400,
          message: 'Su usuario se encuentra inactivo',
        }), res);
      }
      const passwordCheck = await sha1(body.password).toString()


      if (passwordCheck !== user.password) {
        return controllerResponse(
          createErrorResponse({
            httpStatusCode: 403,
            message: 'Contraseña invalida',
          }), res);
      }

      const authToken = generateAuthToken({
        idUser: user.idUser,
      });
      await tokenLibrary.saveUserToken({
        authToken,
        repository: getRepository('UserToken'),
        user,
      });
      const userCopy = { ...user };
      delete userCopy.password;
      return controllerResponse(
        createResponse({
          data: {
            user: userCopy,
            authToken,
          },
          message: 'Usuario logueado correctamente',
        }), res);
    } catch (e) {
      return controllerResponse(createErrorResponse({
        message: 'Server error ' + e,
        data: e,
      }), res);
    }

  }
activeUser =  async (req,res) =>{
  const userRepository = getRepository('User');
  const { body } = req;
  const { email } = body;
  const user = await userRepository.findOne({
    where: {
      email,
    },
  })

  if (!user) {
    return createErrorResponse({
      httpStatusCode: 404,
      message: 'Usuario no encontrado',
    });
  }
  await userRepository.update(
    {
      idUser: user.idUser,
    },
    {
      state: 'active',
    }
  );

  return controllerResponse(createResponse({
    httpStatusCode:201,
    message: 'Usuario activado exitosamente',
    data:{}

  }), res);
}
  sendVerifyPhone = async (req, res) => {
    try {
      const { body } = req;
      const userRepository = getRepository('User');
      const user = (await userRepository.findOne({
        where: {
          email: body.phoneNumber,
        },
      }));


      const code = generateCode();
      const snsMessage = `Tu codigo de verificacion de DrugsOnline es : ${code}`;
      const messageResponse = await awsInstance.sendSMS(
        body.phoneNumber,
        snsMessage
      )



      if (messageResponse.code !== 100) {
        return createErrorResponse({
          httpStatusCode: 400,
          message: 'Fallo al enviar el SMS'
        });
      }
      return controllerResponse(createResponse({
        httpStatusCode: 201,
        message: 'Sms enviado exitosamente',
        data: {
          verificationCode: code
        }

      }), res);
    } catch (e) {
      return controllerResponse(createErrorResponse({
        data: { e },
        message: 'Server error',
      }), res);
    }







  }
  sendVerifyEmail = async (req, res) => {
    try {

      const userRepository = getRepository('User');
      const { body } = req;
      const { email } = body;
      const user = await userRepository.findOne({
        where: {
          email,
        },
      })

      if (!user) {
        return createErrorResponse({
          httpStatusCode: 404,
          message: 'Usuario no encontrado',
        });
      }
      const code = generateCode();
      await mailer.sendMail({
        from: mailConfig.user,
        to: email,
        subject: 'Verificacion de correo',
        template: 'verify-email',
        context: {
          email,
          code,
        },
      });

      // await userRepository.update(
      //   {
      //     idUser: user.idUser,
      //   },
      //   {
      //     state: 'active',
      //   }
      // );

      return controllerResponse(createResponse({
        message: 'Correo verificado exitosamente',
        data: {
          verificationCode: code
        }

      }), res);
    } catch (e) {
      console.error('error in sendVerifyEmail', e);
      return controllerResponse(createErrorResponse({
        data: { e },
        message: 'Server error',
      }), res);
    }
  }

  sendPasswordRecoveryCode = async (req, res) => {
    try {

      const userRepository = getRepository('User');
      const { body } = req;
      const { email } = body;
      const user = await userRepository.findOne({
        where: {
          email,
        },
      })

      if (!user) {
        return controllerResponse(createErrorResponse({
          httpStatusCode: 404,
          message: 'Usuario no encontrado',
        }), res);
      }

      if (user.state !== 'active') {
        return controllerResponse(createErrorResponse({
          httpStatusCode: 400,
          message: 'Su usuario se encuentra inactivo',
        }), res);
      }
      const code = generateCode();
      await mailer.sendMail({
        from: mailConfig.user,
        to: email,
        subject: 'Recuperacion de contraseña',
        template: 'recovery-password',
        context: {
          email,
          code,
        },
      });

      await userRepository.update(
        {
          idUser: user.idUser,
        },
        {
          state: 'active',
        }
      );

      return controllerResponse(createResponse({
        message: 'Correo de verificacion enviado exitosamente!',
        data: {
          verificationCode: code
        }

      }), res);
    } catch (e) {
      console.error('error in sendVerifyEmail', e);
      return controllerResponse(createErrorResponse({
        data: { e },
        message: 'Server error',
      }), res);
    }
  }


  createAccount = async (req, res) => {
    try {

      let { body } = req;
      let user = body;
      const userRepository = getRepository('User');
      const existsUser = await userRepository.findOne({
        where: {
          email: body.email,
        },
      });
      if (existsUser) {
        return controllerResponse(createErrorResponse({
          httpStatusCode: 400,
          message: 'El usuario ya se encuenta registrado!',
        }), res);
      }

      const hashPassword = await sha1(body.password).toString();
      user.password = hashPassword
      user.createdAt = new Date();
      const savedUser = await userRepository.save(user);
      const authToken = generateAuthToken({
        idUser: savedUser.insertId
      });
      await tokenLibrary.saveUserToken({
        authToken,
        repository: getRepository('UserToken'),
        user: savedUser,
      });
      delete savedUser.password;
      await mailer.sendMail({
        template: 'welcome-email',
        to: body.email,
        from: mailConfig.user,
        context: {
          user: body,
          app: appConfig,
        },
      });
      return controllerResponse(
        createResponse({
          httpStatusCode: 201,
          message: 'Usuario creado exitosamente!',
          data: {
            user: savedUser,
            authToken,
          },
        }),
        res
      );

    } catch (e) {
      return controllerResponse(createErrorResponse({
        message: 'Server error ' + e,
        data: e,
      }), res);
    }
  }
  getProfile = async (req, res) => {
    try {
      const userRepository = getRepository('User');

      const user = (await userRepository.findOne({
        where: {
          idUser: (req).user.idUser,
        }
      }));
      delete user.password;

      const authToken = generateAuthToken({
        idUser: user.idUser,

      });
      return controllerResponse(createResponse({
        httpStatusCode:201,
        message:'Usuario obtenido con exito',
        data: {
          user,
          authToken

        },
      }), res);
    } catch (e) {
      console.error('Error in getProfile', e);
      return controllerResponse(createErrorResponse({
        data: e,
        message: 'Server error',
      }));
    }
  }

  disableAccount = async (
    req, res

  ) => {
    try {
      const userRepository = getRepository('User');
      const user = (req).user;
      const { body } = req;
      const passwordCheck = await sha1(body.password).toString()


      if (passwordCheck !== user.password) {
        return controllerResponse(
          createErrorResponse({
            httpStatusCode: 403,
            message: 'Contraseña invalida',
          }), res);
      }

      await userRepository.update(
        {
          idUser: user.idUser,
        },
        {
          options: {
            state: 'inactive',
          },
        }
      );

      return controllerResponse(createErrorResponse({
        message: 'Cuenta desactivada exitosamente',
      }), res);
    } catch (e) {
      console.error('Error in disableACcount', e);
      return controllerResponse(createErrorResponse({
        data: e,
        message: (req).lang.serverError,
      }), res);
    }
  }

  updateProfile = async (
    req, res) => {
    try {
      const { body } = req;
      if (body.password) delete body.password
      const user = (req).user;
      const userRepository = getRepository('User');






      await userRepository.update(
        {
          idUser: user.idUser,
        },
        body
      );

      return controllerResponse(createResponse({
        httpStatusCode:201, 
        message: 'Perfil actualizado exitosamente',
      }), res);
    } catch (e) {
      console.error('Error in updateProfile', e);
      return controllerResponse(createErrorResponse({
        message: 'Server error',
      }), res);
    }
  }
  updatePassword = async (req, res) => {
    try {
      const { body } = req;
      const userRepository = await getRepository('User');

      const user = (await userRepository.findOne({
        where: {
          email: body.email
        },
      }));

      if (!user) {
        return controllerResponse(createErrorResponse({
          httpStatusCode: 404,
          message: 'Usuario no encontrado',
        }), res);
      }
      if (user.state !== 'active') {
        return controllerResponse(createErrorResponse({
          httpStatusCode: 400,
          message: 'Su usuario se encuentra inactivo',
        }), res);
      }

      await userRepository.update(
        {
          idUser: user.idUser,
        },
        {
          password: await sha1(body.password).toString(),
        }
      );

      return controllerResponse(createResponse({
        message: 'Contraseña reestablecida exitosamente!'
      }), res);
    } catch (e) {
      console.error('Error in setPassword', e);
      return createErrorResponse({
        message: 'Error server',
        data: e,
      });
    }
  }

}

module.exports = UserController;