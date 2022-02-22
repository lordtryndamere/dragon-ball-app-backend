const {Router} = require('express');
const {VideoController} = require('../../controllers/v1')
const video = new VideoController();
const {vertifyTokenMiddleware} = require('../../middlewares/verify-token.middleware')
module.exports = () =>{
    const router = Router();
    router.get('/get-image/nameImage/mimetype',video.getImage)
    router.get('/get-video/:videoId',video.getVideo)

    return router
}