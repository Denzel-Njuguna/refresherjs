require('dotenv').config()
const express = require('express')
const port = process.env.port || 3000
const routes = require("./routes/index")
const app = express()
app.use(express.json())
app.use(routes)

app.listen(port,()=>{
    try{
        console.log(`server listening on port ${port}`)
    } catch (error) {
        console.log(`there was an error ${error}`)
    }
})
