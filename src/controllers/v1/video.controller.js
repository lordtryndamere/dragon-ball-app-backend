const fs = require('fs');
const path = require('path')   
class VideoController {
    getVideo = async (req, res) => {
            const videoId = req.params.videoId;
            const mimetype = nameImage.split('.')[1];
            fs.readFile(path.join(__dirname, '../../../uploads/'+videoId),(err,data)=>{
                if(err) return res.status(500).send({err})
                res.writeHead(200,{'Content-type':`video/${mimetype}`})
                res.write(data);
                res.end();
            });
     
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