const { Router } = require('express');
const { MovieController } = require('../../controllers/v1')
const movie = new MovieController();
const { vertifyTokenMiddleware } = require('../../middlewares/verify-token.middleware')
module.exports = () => {
    const router = Router();
    router.get('/get-by-category/:categoryId', vertifyTokenMiddleware('access'), movie.getMoviesByCategory);
    router.get('/get-categories', vertifyTokenMiddleware('access'), movie.getCategories);
    router.post('/get-movies', vertifyTokenMiddleware('access'), movie.getMovies);
    router.post('/create-movie', vertifyTokenMiddleware('access'), movie.createMovie);
    router.post('/create-category', vertifyTokenMiddleware('access'), movie.createCategory);


    return router
}