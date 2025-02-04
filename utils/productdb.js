const {pool} = require("./db")
const fetchidvalidation = require('./validation')


const fetchproducts = (async(req,res)=>{
    try {
        const query = ("select * from learning.products")
        const results = await pool.query(query)
        const allproducts = results.rows
        return res.status(200).send(allproducts)
        } catch (error) {
            console.log(`there is an error ${error} in fetch products`)
        }
    
})

const fetchproduct = (async (req,res) => {
    try {
        const{id} = req.entered_info
        const query = ("select product_name,product_description,product_file,product_path from learning.products where product_id = $1")
        const result = await pool.query(query,[id])
        if (result.rowCount != 0){
            const product_data = result.rows[0]
            return res.status(200).send(product_data)
        }else{
            console.log("sorry this product is out of stock")
            return res.status(200).send({msg:`currently we are out of stock`})
        }
    } catch (error) {
        console.log(`there is an error ${error} fetchproduct`)
    }
})
module.exports = {fetchproducts,fetchproduct}