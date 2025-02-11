const {body,param} = require("express-validator")

const logvalidationstart = (req,res,next)=>{
    console.log("validation has started")
    next()
}
const logvalidationend = (req,res,next)=>{
    console.log("the validation has ended")
    next()
}
const postuservalidation = [
    logvalidationstart,
    body("username")
        .notEmpty()
        .withMessage("this field should not be empty")
        .isLength({min:3,max:15})
        .withMessage("should be of min length 3 characters and max 15"),
    body("password")
        .notEmpty()
        .withMessage("should not be empty")
        .isStrongPassword({
            minLength:8,
            minLowercase:2,
            minUppercase:2,
            minSymbols:1,
            minNumbers:2
        })
        .withMessage("it should atleast have 8 characters,(2) lowecase,uppercase and numbers and 1 number")
        .isString()
        .withMessage("should be a string"),
        logvalidationend
]
const fetchidvalidation = [
    logvalidationstart,
    param("id")
        .notEmpty()
        .withMessage("this should not be empty")
        .isInt()
        .withMessage('it should be a string only'),
    logvalidationend
]

const postproductvalidation = [
    body("productname")
        .notEmpty()
        .withMessage("this field should be filled")
        .isString()
        .withMessage("should be a string"),
    body("productdescription")
        .notEmpty()
        .withMessage("this field should be filled")
        .isString()
        .withMessage("should be a string")
]

module.exports = {fetchidvalidation,postuservalidation,postproductvalidation}