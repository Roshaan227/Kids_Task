const express = require('express')
const { loginHandler,signupHandler } = require('../controllers/userController')


const router= express.Router()


router.post("/signup",signupHandler)

router.post("/login",loginHandler)




module.exports=router