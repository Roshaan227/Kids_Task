const express= require('express')
const app= express()
const userHandler = require('./routes/userRouter')



const db =require('./models')
app.use(express.json())


app.use(express.urlencoded({extended:true}))


const port=3000;

app.use('/user', userHandler)

app.listen(port,()=>console.log(`app is running on port ${port}`))

