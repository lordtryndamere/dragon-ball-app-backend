// getting-started.js
const mongoose = require('mongoose');  //configure to mongodb database

main().catch(err => console.log(err));
main().then(()=>console.log('Conexion exitosa a Cluster'))
async function main() {
    mongoose.Promise = global.Promise;
  await mongoose.connect(process.env.URI_CONECTION)
}



module.exports = main