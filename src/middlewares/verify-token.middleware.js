const { verify } = require ('jsonwebtoken');
const  { getRepository } = require('typeorm');
const {
  controllerResponse,
  createErrorResponse,
} = require('../tools/response');


 const vertifyTokenMiddleware = (token) => {
  return async (req, res, next) => {
    try {
      const appShortName = (process.env.SHORT_NAME ).toUpperCase();
      const headerName = token === 'access' ? 'Access' : 'Auth';
      const header = req.header(
        `X-${appShortName}-${headerName}-Token`
      );

      if (!header) {
        return controllerResponse(
          createErrorResponse({
            message: 'El token no ha sido encontrado',
            httpStatusCode: 400,
            code: 120,
          }),
          res
        );
      }

      const tokenVerifiedContent = verify(
        header,
        process.env.JWT_SECRET
      );

      if (!tokenVerifiedContent) {
        return controllerResponse(
          createErrorResponse({
            code: 120,
            httpStatusCode: 403,
            message: 'El token es inválido',
          }),
          res
        );
      }

      if (token === 'auth') {
        const repository = getRepository('User');
        const tokenRepository = getRepository('UserToken');

        const user = await repository.findOne({
          where: {
            idUser: tokenVerifiedContent.idUser,
          },
     
        });

        if (!user) {   
          return controllerResponse(
            createErrorResponse({
              message:'Ha ocurrido un error al validar el token',
              code: 120,
            }),
            res
          );
        }

        await tokenRepository.update(
          {
            user: {
                idUser: tokenVerifiedContent.idUser,
            },
          },
          {
            lastUsed: new Date(),
          }
        );

        (req).user = user;
   
      }

      next();
    } catch (error) {

      console.error('Error en verify token:', error);
      return controllerResponse(
        createErrorResponse({
          code: 120,
          message: 'Ha ocurrido un error al validar el token',
        }),
        res
      );
    }
  };
};


module.exports = {
    vertifyTokenMiddleware
}