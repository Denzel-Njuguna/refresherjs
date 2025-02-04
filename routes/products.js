const {Router} = require("express")
const multer = require("multer")
const {validationResult,matchedData} = require("express-validator")
const fetchproducts = require("../utils/productdb")

const productroutes = Router()

productroutes.get('/products',fetchproducts)

module.exports = productroutes