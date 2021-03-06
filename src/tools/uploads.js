const path = require('path');
const uploadFiles =  (file)=>{
    try {
        const name  = `${Math.random().toString(36).slice(2)}-${file.name.replace(/\s+/g, '')}`
      file.mv(path.join(__dirname, '../../uploads/'+name));

        return{
            status:true,
            code:100,
            message:'file uploaded',
            data:{
                name: name, 
                mimetype: file.mimetype,
                size: file.size
            }
        }        
    } catch (error) {
        return{
            error
        }
    }

}

module.exports = {uploadFiles};