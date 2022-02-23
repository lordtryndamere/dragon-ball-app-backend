const fs = require('fs');
const path = require('path')   
class VideoController {
    getVideo = async (req, res) => {
        try {
            const range = req.headers.range;
            if (!range) {
              return res.status(400).send("Range not provided");
            }
          
            const videoId = req.params.videoId;
            const videoPath = path.join(__dirname, '../../../uploads/'+videoId);
            const videoSize = fs.statSync(videoPath).size;
            const chunkSize = 10 ** 6; // 1 mb
            const start = Number(range.replace(/\D/g, ""));
            const end = Math.min(start + chunkSize, videoSize - 1);
            const contentLength = end - start + 1;
            const headers = {
              "Content-Range": `bytes ${start}-${end}/${videoSize}`,
              "Accept-Ranges": "bytes",
              "Content-Length": contentLength,
              "Content-Type": "video/mp4",
            };
            res.writeHead(206, headers);
            const videoStream = fs.createReadStream(videoPath, { start, end });
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