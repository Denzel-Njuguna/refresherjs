require("dotenv").config()
const argon2 = require("argon2")
const {Pool} = require('pg')
const { matchedData } = require("express-validator")


let pool
if(!pool){
    pool = new Pool({
    host:process.env.hostname,
    database:process.env.databasename,
    port:process.env.databaseport,
    user:process.env.databaseuser,
    password:process.env.dbpassword
})}

pool.connect()

const fetchusers = (async (req,res,next) => {
    try {
        const result =await pool.query("select * from learning.students")
        req.appusers = result.rows
        next()
    } catch (error) {
        console.log("there was an error fetching all the user",error)
        next(error)
    }

})
const fetchuser = (async (req,res,next) => {
    try {
        const {id} = req.entered_info
        const query  = ("select index,username from learning.students where index = $1 ")
        const result = await pool.query(query,[id])
        if(result.rowCount === 0 ) 
            return res.status(400).send({msg:"this user does not exist"})
        const user_details = result.rows[0] 
        return res.status(200).send({id:user_details.index,name:user_details.username})
        
    } catch (error) {
        console.log(` there was and error retrieving the user ${error}`)
    }
})


const checkuser = (async (req,res,next) => {
    const {username} = req.entered_info
    const query = "select * from learning.students where username = $1"
    const result =await pool.query(query,[username])
    try {
        if(!result.rowCount === 0){
            return res.status(400).send({msg: `username ${value} already in use`})
        } else{
            req.newuser = matchedData(req)
        }
    } catch (error) {
        console.log(`error ${error} at check user`)
    }
    next()
})

const hashingpassword = [
    async (password) => {
    const hashedpassword = await argon2.hash(password)
    return hashedpassword
},
    async(password, hashedpassword)=>{
        try{
            const ismatch = argon2.verify(hashedpassword,password)
            return ismatch
        }catch(error){
            return false
        }
    }
]
const postuser = (async (req,res) => {
    console.log("posting of user has begun")
    try {
        let {password} = req.newuser
        let already_hashed_password = await hashingpassword[0](password)
        if (already_hashed_password == false) return res.status(500).send({msg:"there was an error in storing your password"})
        console.log(already_hashed_password)
        const query = "insert into learning.students(username,password,name) values ($1,$2,$3) returning username,index,name"
        const values = [req.newuser.username,already_hashed_password,req.newuser.name]
        const result = await pool.query(query,values)
        const registereduser = result.rows[0]
        console.log(`${registereduser} was successfully put into the backend`)
        return res.status(201).send({id:registereduser.id,username:registereduser.username,msg:`user ${registereduser.name} added successfully`,user:registereduser.name,redirectto:"/testing/home"})
    } catch (error) {
        res.status(400).send("there was an error in adding this new user")
        console.log("there was an error in posting the user",error)
    }
})


// we want to close the connection as the last thing and not after every function
const closeconnection = (async () => {
    try {
        await pool.end()
    console.log("the connection is closed")
    } catch (error) {
        console.log('there was an error in closing the connection ')
    }
    
})
module.exports = {pool,checkuser,postuser,fetchuser,fetchusers,closeconnection}