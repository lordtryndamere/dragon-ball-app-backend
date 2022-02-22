const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const morgan  = require('morgan');
const cors = require('cors');
const app = express();
const helmet = require('helmet');
require('dotenv-flow').config();

const  routers  = require('./routers');

const port = process.env.PORT || 8087
//const initializeDb  = require('./config/typeorm')
const main = require('./config/mongodb')
async function init(){
    await  main()
}
init()
app.use(fileUpload({createParentPath:true}));


app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));



app.use(routers())
app.listen(port, () => {
console.log(`server on port ${port}`);
console.log(`Environment ${process.env.NODE_ENV}`);
});