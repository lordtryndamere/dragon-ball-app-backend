const fs = require('fs');
const path = require('path')   
class VideoController {
    getVideo = async (req, res) => {
        try {
            const videoId = req.params.videoId;
            const videoPath = path.join(__dirname, '../../../uploads/'+videoId);
            const headers = {
              "Content-Type": "video/mp4",
            };
            res.writeHead(200, headers);
            const videoStream = fs.createReadStream(videoPath);
            videoStream.pipe(res);
        } catch (error) {
            return res.status(500).send(error)
        }
    }

    getImage = async (req,res)=>{
        const nameImage = req.params.nameImage;
        const mimetype = nameImage.split('.')[1];
        fs.readFile(path.join(__dirname, '../../../uploads/'+nameImage),(err,data)=>{
            if(err) return res.status(500).send({err})
            res.writeHead(200,{'Content-type':`image/${mimetype}`})
            res.write(data);
            res.end();
        });
    }




}

module.exports = VideoController;