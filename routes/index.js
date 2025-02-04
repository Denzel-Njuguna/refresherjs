const express = require('express')
const userroutes = require('./user')
const productroutes = require('./products')

const consolidatedroutes = express()
consolidatedroutes.use(express.json())
consolidatedroutes.use(userroutes)
consolidatedroutes.use(productroutes)

module.exports = consolidatedroutes