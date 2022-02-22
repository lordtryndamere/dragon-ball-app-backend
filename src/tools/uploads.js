
const uploadFiles = (req)=>{
    try {
        let file = req.files.file;
        const name  = `${Math.random().toString(36).slice(2)}-${file.name}`
        file.mv('../../uploads/'+name);
        return{
            status:true,
            code:100,
            message:'file uploaded',
            data:{
                name: name,
                mimetype: avatar.mimetype,
                size: avatar.size
            }
        }        
    } catch (error) {
        return{
            error
        }
    }

}

module.exports = {uploadFiles};