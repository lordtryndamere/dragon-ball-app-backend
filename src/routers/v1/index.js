const {Router}  = require('express');
const userRouter  = require('./user.router');
const movieRouter  = require('./movie.router');
//const productsRouter  = require('./products.router');
const videoRouter = require('./video.router');
module.exports = ()=>{
    const router = Router();
    router.use('/users',userRouter())
    router.use('/movie',movieRouter())
    //router.use('/products',productsRouter())
    router.use('/video',videoRouter())


    return router;
}