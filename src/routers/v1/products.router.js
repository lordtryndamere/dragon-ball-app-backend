const {Router} = require('express');
const {ProductsController} = require('../../controllers/v1')
const products = new ProductsController();
const {vertifyTokenMiddleware} = require('../../middlewares/verify-token.middleware')
module.exports = () =>{
    const router = Router();
    router.post('/get-products',vertifyTokenMiddleware('access'),products.getProducts)

    return router
}