const {Router} = require('express')
const {validationResult,matchedData} = require("express-validator")
const userroutes = Router()
const {postuservalidation,fetchidvalidation} = require("../utils/validation")
const {postuser,fetchuser,fetchusers,closeconnection,checkuser} = require("../utils/db")

userroutes.get('/users',fetchusers,(req,res)=>{
    const appusers = req.appusers
    console.log(appusers)
    res.status(200).send(appusers)
})
//this is to get a specific user
userroutes.get("/users/:id",
    fetchidvalidation,
    async(req,res,next)=>{
    const result = validationResult(req)
    if(!result.isEmpty()){
        return res.status(400).send("the id is not correct")
    }
    req.entered_info = matchedData(req)
    next()
},
fetchuser
)


userroutes.post("/users",
    postuservalidation,
    async (req,res,next)=>{
        const result = validationResult(req)
        console.log(result)
        try {
            if(!result.isEmpty()) return res.status(400).send({msg:result.array()})
            req.entered_info = matchedData(req)
           
        } catch (error) {
            console.log(`there is an error ${error} before checking if user exists`)
        }
        next()
    },

    checkuser,
    postuser    
)
module.exports = userroutes