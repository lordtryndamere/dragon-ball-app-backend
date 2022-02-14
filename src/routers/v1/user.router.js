const {Router} = require('express');
const {UserController} = require('../../controllers/v1')
const user = new UserController();
const {vertifyTokenMiddleware} = require('../../middlewares/verify-token.middleware')
module.exports = () =>{
    const router = Router();
    router.post('/create-account',vertifyTokenMiddleware('access'),user.createAccount)
    router.get('/generate-access-token', user.getAccessToken);
    router.post('/login',vertifyTokenMiddleware('access'),user.login)
    router.post('/veriphy-phone',vertifyTokenMiddleware('access'),user.sendVerifyPhone)
    router.post('/send-password-recovery-code',vertifyTokenMiddleware('access'),user.sendPasswordRecoveryCode)
    router.post('/veriphy-email',vertifyTokenMiddleware('access'),user.sendVerifyEmail)
    router.get('/get-profile',vertifyTokenMiddleware('auth'),user.getProfile)
    router.delete('/disable-account',vertifyTokenMiddleware('auth'),user.disableAccount)
    router.put('/update-profile',vertifyTokenMiddleware('auth'),user.updateProfile)
    router.put('/update-password',vertifyTokenMiddleware('access'),user.updatePassword)
    router.put('/active-user',vertifyTokenMiddleware('access'),user.activeUser)
    return router
}