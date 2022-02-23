
//const { getRepository, Like } = require('typeorm');
const { movie, category } = require('../../schemas')
const { AwsLib } = require('../../tools/aws')
//const awsInstance = new AwsLib();
const { createErrorResponse, createResponse, controllerResponse } = require('../../tools/response');
const { uploadFiles } = require('../../tools/uploads');

class MovieController {
  getMovies = async (req, res) => {
    try {
      const { body } = req;
      const arg = body.filter;
      let movies = await movie.find({ "name": { $regex: arg, $options: 'i' }, status: 'active' }).populate({ path: 'category' })


      if (movies.length == 0) {
        return controllerResponse(
          createErrorResponse({
            httpStatusCode: 404,
            message: 'No encontramos nada ',
            data: {
              movies
            }
          }), res);
      }
      movies = movies.map((value) => {
        return {
          id:value._id,
          name: value.name,
          sinopsis: value.sinopsis,
          mimeType:value.mimeType,
          posterImg: process.env.NODE_ENV == 'development' ? `${process.env.EndPointLocal}/video/get-image/${value.posterImg}`  :  `${process.env.HEROKU_ENDPOINT}/video/get-image/${value.posterImg}`,
          status: value.status,
          videoUri: process.env.NODE_ENV == 'development' ? `${process.env.EndPointLocal}/video/get-video/${value.videoUri}`  :  `${process.env.HEROKU_ENDPOINT}/video/get-video/${value.videoUri}`,
          categoryId: value.category[0]._id,
          categoryName: value.category[0].name,
          categoryStatus: value.category[0].status

        }
      });
      return controllerResponse(createResponse({
        httpStatusCode: 201,
        message: 'Peliculas  listadas!',
        data: {
          movies
        },
      }), res);
    } catch (e) {

      return controllerResponse(createErrorResponse({
        data: e,
        message: 'Server error',
      }), res);
    }
  }

  createMovie = async (req, res) => {
    try {
      const { body, files } = req;
      const arrFiles = [
        { posterImg: files.posterImg },
        { videoUri: files.videoUri }
      ];

      const ifExistsMovie = await movie.findOne({ 'name': body.name });
      if (ifExistsMovie) {
        return controllerResponse(
          createErrorResponse({
            httpStatusCode: 402,
            message: 'Esta pelicula ya existe',
          }), res);
      }
      let saveMovie = { ...body, created_at: Date.now };

      for (const iterator of arrFiles) {
        let key = Object.keys(iterator)[0];

       

        if (key === 'posterImg'){
          //let upload = await awsInstance.uploadFile(iterator.posterImg, 'movies/assets');
            let upload =   uploadFiles(iterator.posterImg);  
              saveMovie =  {...saveMovie,posterImg:upload.data.name,mimeType:upload.data.mimetype};
        } 
        if (key === 'videoUri'){
          //let upload = await awsInstance.uploadFile(iterator.videoUri, 'movies/assets');
          let upload =  uploadFiles(iterator.videoUri);  
          saveMovie =    saveMovie = {...saveMovie,videoUri:upload.data.name} ;
        } 
      }



    let savedMovie =   await movie.create(saveMovie);
  
      return controllerResponse(createResponse({
        httpStatusCode: 201,
        message: 'Pelicula  creada!',
        data: {
          savedMovie
        },
      }), res);

    } catch (e) {
      return controllerResponse(createErrorResponse({
        data: e,
        message: 'Server error',
      }), res);
    }
  }

  createCategory = async (req, res) => {
    try {
      const { body } = req;
      const ifExistsCategory = await movie.findOne({ 'name': body.name });
      if (ifExistsCategory) {
        return controllerResponse(
          createErrorResponse({
            httpStatusCode: 402,
            message: 'Esta categoria ya esta creada ...',
          }), res);
      }
      const saveCategory = { ...body, created_at: Date.now }
      await category.create(saveCategory);
      return controllerResponse(createResponse({
        httpStatusCode: 201,
        message: 'Categoria   creada!',
        data: {
          saveCategory
        },
      }), res);

    } catch (e) {
      return controllerResponse(createErrorResponse({
        data: e,
        message: 'Server error',
      }), res);
    }
  }

  getMoviesByCategory = async (req, res) => {
    try {
      const { params } = req;

      let movies = await movie.find({ "category": params.categoryId, status: 'active' }).populate({ path: 'category' })


      if (movies.length == 0) {
        return controllerResponse(
          createErrorResponse({
            httpStatusCode: 404,
            message: 'No encontramos nada ',
            data: {
              movies
            }
          }), res);
      }
      movies = movies.map((value) => {
        return {
          id:value._id,
          name: value.name,
          sinopsis: value.sinopsis,
          posterImg: process.env.NODE_ENV == 'development' ? `${process.env.EndPointLocal}/video/get-image/${value.posterImg}`  :  `${process.env.HEROKU_ENDPOINT}/video/get-image/${value.posterImg}`,
          status: value.status,
          videoUri: process.env.NODE_ENV == 'development' ? `${process.env.EndPointLocal}/video/get-video/${value.videoUri}`  :  `${process.env.HEROKU_ENDPOINT}/video/get-video/${value.videoUri}`,
          categoryId: value.category[0]._id,
          categoryName: value.category[0].name,
          mimeType:value.mimeType,
          categoryStatus: value.category[0].status
        }
      });
      return controllerResponse(createResponse({
        httpStatusCode: 201,
        message: 'Peliculas  listadas!',
        data: {
          movies
        },
      }), res);
    } catch (e) {

      return controllerResponse(createErrorResponse({
        data: e,
        message: 'Server error',
      }), res);
    }
  }


  getCategories = async (req, res) => {
    try {

      let categories = await category.find({ status: 'active' });


      if (categories.length == 0) {
        return controllerResponse(
          createErrorResponse({
            httpStatusCode: 404,
            message: 'No encontramos nada ',
            data: {
              categories
            }
          }), res);
      }
      return controllerResponse(createResponse({
        httpStatusCode: 201,
        message: 'Categorias listadas correctamente',
        data: {
          categories
        },
      }), res);
    } catch (e) {

      return controllerResponse(createErrorResponse({
        data: e,
        message: 'Server error',
      }), res);
    }
  }




}

module.exports = MovieController;