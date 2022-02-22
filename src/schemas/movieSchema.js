const mongoose  = require('mongoose');
const  movieSchema = mongoose.Schema({
    name:String,
    sinopsis:String,
    posterImg:String,
    status:{type:String,default:'active'},
    videoUri:String,
    mimeType:String,
    category:[{type:mongoose.Schema.Types.ObjectId,ref:'category'}],
    create_at:{ type: Date, default: Date.now },
    updated_at:{ type: Date, default: Date.now },
})

module.exports = {movie:mongoose.model('movie',movieSchema)};