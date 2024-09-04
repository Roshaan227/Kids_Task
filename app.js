

const express= require('express')
const app= express()

const db =require('./models')
app.use(express.json())
const createApi=require('./routes/userRouter')

app.use(express.urlencoded({extended:true}))


const port=3000;



app.listen(port,()=>console.log(`app is running on port ${port}`))



