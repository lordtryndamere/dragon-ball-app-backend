const userModel = require('../models/users.model');
const roleModel = require('../models/rolle.model');
const userTokenModel = require('../models/user-token.model');
const drugsModel = require('../models/drugs.model');
const productsModel = require('../models/products.model');


module.exports = [
    userModel, roleModel,userTokenModel,drugsModel,productsModel
]