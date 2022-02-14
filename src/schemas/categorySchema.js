const mongoose = require('mongoose');
const  categorySchema = mongoose.Schema({
    name:String,
    description:String,
    imgCategory:String,
    status:{type:String,default:'active'},
    create_at:{ type: Date, default: Date.now },
    updated_at:{ type: Date, default: Date.now },
})

module.exports = {category:mongoose.model('category',categorySchema)};