const {Router} = require("express")
const multer = require("multer")
const {validationResult,matchedData} = require("express-validator")
const {fetchproducts,fetchproduct} = require("../utils/productdb")
const {fetchidvalidation} = require('../utils/validation')
const productroutes = Router()

productroutes.get('/products',fetchproducts)


productroutes.get('/products/:id',
    fetchidvalidation,
    async (req,res,next) => {
        const results = validationResult(req)
        if(!results.isEmpty()) 
            return res.status(400).send(results.array())
        req.entered_info = matchedData(req)
        next()
},
fetchproduct
)

module.exports = productroutes