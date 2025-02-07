const express = require('express')
const userroutes = require('./user')
const productroutes = require('./backend_Products')
const testingroutes = require("./testing")


const consolidatedroutes = express()
consolidatedroutes.use(express.json())
consolidatedroutes.use(userroutes)
consolidatedroutes.use(productroutes)
consolidatedroutes.use(testingroutes)

module.exports = consolidatedroutes