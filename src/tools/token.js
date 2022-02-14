const {sign} = require('jsonwebtoken');
const {USER_STATES}  = require('../constants/states');
const {appConfig} = require('../config/app')
const generateAccessToken = () => sign({}, process.env.JWT_SECRET);
const generateAuthToken = (jwtContent) => {
    const token = sign(jwtContent, process.env.JWT_SECRET);
  
    return token;
  };

class TokenTool{
    saveUserToken = async (options) => {
        const tokenRepository = options.repository;
        if (appConfig.multipleLogin) {
          await tokenRepository.save({
            authToken: options.authToken,
            lastUsed: new Date(),
            user: {
                idUser: options.user.idUser,
            },
    
          } );
        } else {
          const token = (await tokenRepository.findOne({
            where: {
              user: {
                idUser: options.user.idUser,
              },
              options: {
                status: USER_STATES.ACTIVE,
              },
            },
          })) 
    
          if (token) {
            await tokenRepository.update(
              {
                id: token.id,
              },
              {
                authToken: options.authToken,
                lastUsed: new Date(),
              }
            );
          } else {
            await tokenRepository.save({
              authToken: options.authToken,
              lastUsed: new Date(),   
              user: options.user,

            } );
          }
        }
      };
}
module.exports = {
    TokenTool,
    generateAccessToken,
    generateAuthToken

}