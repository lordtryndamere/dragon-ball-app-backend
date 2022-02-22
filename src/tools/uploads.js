
const uploadFiles = async (file)=>{
    console.log(file);
    try {
        const name  = `${Math.random().toString(36).slice(2)}-${file.name}`
     let move =  await file.mv('./public/uploads'+name);
     console.log(move);
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