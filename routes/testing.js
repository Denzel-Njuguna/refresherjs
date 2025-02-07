const {Router} = require('express')
const path = require('path')
const testingroutes = Router()
const multer = require('multer')

const upload = multer({storage:multer.memoryStorage()})
testingroutes.get('/testing',(req,res)=>{
    const users  = [{
        "userid":"1",
        "name":"Denzel",
        "phone":"010101010101"
    },{
        "userid":"2",
        "name":"john",
        "phone":"020202020202"
    }]
    return res.json(users)
})
testingroutes.post('/testing',upload.single('image'),(req,res)=>{
    try {
        const {productname,productdescription} = req.body
        console.log(productname)
        //here i pass the location of the next page using the redirectTo key
        res.json({message:"successfully posted the image",redirectTo:'/testing/home'})
    } catch (error) {
        console.log(`the error is ${error}`)
    }
    
})

testingroutes.get('/testing/home',(req,res)=>{
    res.sendFile(path.join(__dirname,'../public/home.html'))
})
module.exports = testingroutes