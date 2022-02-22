
const { getRepository, Like } = require('typeorm');
const { AwsLib } = require('../../tools/aws')
const awsInstance = new AwsLib();

const { createErrorResponse, createResponse, controllerResponse } = require('../../tools/response')
const fs = require('fs');
class VideoController {
    getVideo = async (req, res) => {
   
        const videoId = req.params.videoId;
        const videoPath = `./uploads/${videoId}`;
        const headers = {
          "Content-Type": "video/mp4",
        };
        res.writeHead(206, headers);
        const videoStream = fs.createReadStream(videoPath);
        videoStream.pipe(res);
    }

    getImage = async (req,res)=>{
        const nameImage = req.params.nameImage;
        const mimetype = req.params.mimetype;
        fs.readFile(`./uploads/${nameImage}`,(err,data)=>{
            if(err) return res.status(500).send({err})
            res.writeHead(200,{'Content-type':`image/${mimetype}`})
            res.write(data);
            res.end();
        });
    }




}

module.exports = VideoController;