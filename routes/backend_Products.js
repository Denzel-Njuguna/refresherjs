const multer = require("multer")
const path = require("path")
const {Router} = require("express")
const {validationResult,matchedData} = require("express-validator")
const {fetchproducts,fetchproduct} = require("../utils/productdb")
const {fetchidvalidation,postproductvalidation} = require('../utils/validation')
const { error } = require("console")
const { pool } = require("../utils/db")
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
// this is creating the storage engine
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
    // The callback (cb) is called with two arguments:
    // 1. Error (if any), here it's null because no error occurs.
    // 2. The destination folder.
    cb(null,'../components/image_uploads')
    },
    filename:(req,file,cb)=>{
        //this basically creates a unique suffix for the file using date and math fn
        const suffix = Date.now() + "_" + Math.round(Math.random() * 1e9)
        // this retrieves the file format
        const ext = path.extname(file.originalname)
        cb = (null,file.name+"_"+ suffix+ext)
    }
})

//this is to filter the uploaded images 
const filefilter = (req,file,cb)=>{
    if(file.mimetype.startsWith('image/')){
        cb(null,true)
    }else{
        cb(new error('only image files are allowed'),false)
    }
}
// this is creating an instance of the engine to use
const upload = multer({storage:storage,fileFilter:filefilter})

productroutes.post('/products',
        upload.array('images',5),
        postproductvalidation,
        async(req,res)=>{
            try {
                const result = validationResult(req)
                if(!result.isEmpty){
                    return res.status(400).send("it did not meet the parameters")
                }
                const {name,description} = req.body 
                const files = req.files
                const query = "insert into learning.products(product_name,product_description,product_file,product_path) values ($1,$2,$3,$4)"
                const results = await pool.query(query,[
                    name,
                    description,
                    files[0].filemame,
                    files[0].path
                ])
                return res.status(200).send({msg:"files added successfully "})
            } catch (error) {
                console.error('Error in product upload:', error);
            res.status(500).json({ message: 'Error uploading product', error: error.message });
            }
        }
    )

module.exports = productroutes