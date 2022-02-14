
const { getRepository, Like } = require('typeorm');


const { createErrorResponse, createResponse, controllerResponse } = require('../../tools/response')

class ProductsController {








    getProducts = async (req, res) => {
        try {
            const ProductsRepository = getRepository('Products');
            const Products = (await ProductsRepository.find({
                where: {
                    drug:{
                        idDrug: req.body.idDrug,
                    },
                    name: Like(`%${!req.body.filter ? '' : req.body.filter}%`),
                    state: 'active',
                }
            }));
            return controllerResponse(createResponse({
                httpStatusCode: 201,
                message: 'Productos listados!',
                data: {
                    Products
                },
            }), res);
        } catch (e) {
            console.error('Error in getProducts', e);
            return controllerResponse(createErrorResponse({
                data: e,
                message: 'Server error',
            }));
        }
    }




}

module.exports = ProductsController;