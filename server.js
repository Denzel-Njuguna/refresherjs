require('dotenv').config()
const path = require('path')
const express = require('express')
const port = process.env.port || 3000
const routes = require("./routes/index")
const app = express()
app.use(express.json())
app.use(routes)
app.use(express.static("public"))
app.get("/",(req,res)=>{
    return res.sendFile(path.join(__dirname,"public","products.html"))
})
app.listen(port,()=>{
    try{
        console.log(`server listening on port ${port}`)
    } catch (error) {
        console.log(`there was an error ${error}`)
    }
})
