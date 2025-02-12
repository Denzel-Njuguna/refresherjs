const multer = require("multer")
const path = require("path")
const {Router} = require("express")
const {validationResult,matchedData} = require("express-validator")
const {fetchproducts,fetchproduct} = require("../utils/productdb")
const {fetchidvalidation,postproductvalidation} = require('../utils/validation')
const { error } = require("console")
const { pool } = require("../utils/db")
const productroutes = Router()
exports.productroutes = productroutes

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
    cb(null,path.join(__dirname,'../components/image_uploads'))
    },
    filename:(req,file,cb)=>{
        //this basically creates a unique suffix for the file using date and math fn
        const suffix = Date.now() + "_" + Math.round(Math.random() * 1e9)
        // this retrieves the file format
        const ext = path.extname(file.originalname)
        cb(null,file.name+"_"+ suffix+ext)
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
        upload.array('files',5),
        postproductvalidation,
        async(req,res)=>{
            try {
                console.log("the backend has started working")
                const result = validationResult(req)
                if(!result.isEmpty){
                    return res.status(400).send("it did not meet the parameters")
                }
                const {productname,productdescription} = req.body 
                const files = req.files
                if (!files || files.length == 0 ){
                    return res.send({msg:'no files were uploaded'})
                }
                if (files.length> 5){
                    return res.send({msg:"the files uploaded are more than five"})
                }

                const filenames = files.map(file => file.filename)
                const filepaths = files.map(file=>file.path)

                const query = `insert into learning.products(
                product_name,
                product_description,
                product_file1,
                product_path1,
                product_file2,
                product_path2,
                product_file3,
                product_path3,
                product_file4,
                product_path4,
                product_file5,
                product_path5
                )
                values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) returning product_name`
                const values = [
                    productname,
                    productdescription,
                    filenames[0] || null,
                    filepaths[0] || null,
                    filenames[1] || null,
                    filepaths[1] || null,
                    filenames[2] || null,
                    filepaths[2] || null,
                    filenames[3] || null,
                    filepaths[3] || null,
                    filenames[4] || null,
                    filepaths[4] || null
                ]
               try {
                // in pg it returns an array
                 const results = await pool.query(query,values)
                 console.log(results.rows)
                 const result_name = results.rows[0]
                 return res.status(200).json({msg:`successfully added ${result_name} `,redirectto:'/testing/home',result:result_name})
               } catch (error) {
                 console.log("error when posting to the backend")
                 return res.status(500).json({error:"internal server error",error})
               }
            } catch (error) {
                console.error('Error in product upload:', error);
            res.status(500).json({ message: 'Error uploading product', error: error.message });
            }
        }
    )

productroutes.get('/testing/home',(req,res)=>{
    res.sendFile(path.join(__dirname,'../public/home.html'))
})


module.exports = productroutes