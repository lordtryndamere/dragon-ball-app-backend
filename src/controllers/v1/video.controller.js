
const { getRepository, Like } = require('typeorm');
const { AwsLib } = require('../../tools/aws')
const awsInstance = new AwsLib();

const { createErrorResponse, createResponse, controllerResponse } = require('../../tools/response')
const fs = require('fs');
class VideoController {



    getVideos = async (req, res) => {
       fs.readFile('./uploads/video-example.mp4',(err,data)=>{
           res.writeHead(200,{'Content-Type':'video/mp4'});
           res.write(data);
           res.end();

       })
    }




}

module.exports = VideoController;