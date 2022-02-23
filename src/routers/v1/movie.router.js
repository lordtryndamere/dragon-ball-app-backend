const { Router } = require('express');
const { MovieController } = require('../../controllers/v1')
const movie = new MovieController();
const { vertifyTokenMiddleware } = require('../../middlewares/verify-token.middleware')
module.exports = () => {
    const router = Router();
    router.get('/get-by-category/:categoryId', movie.getMoviesByCategory);
    router.get('/get-categories', movie.getCategories);
    router.post('/get-movies',  movie.getMovies);
    router.post('/create-movie', vertifyTokenMiddleware('access'), movie.createMovie);
    router.post('/create-category', vertifyTokenMiddleware('access'), movie.createCategory);


    return router
}   