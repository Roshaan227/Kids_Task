require('dotenv').config()
const express= require('express')
const app= express()
const userHandler = require('./controllers/authController')
const familyHandler = require('./controllers/familyController')
const roleHandler = require('./controllers/roleController')
const hobbyHandler = require('./controllers/hobbyController')
const taskHandler = require('./controllers/taskController')
const authenticateToken = require('./middleware/authenticateToken')

const { sequelize } = require('./models');

sequelize.sync()
  .then(() => {  
    console.log('Database synced and ready.');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });


const db =require('./models')     

app.use(express.json())


app.use(express.urlencoded({extended:true}))


const port= process.env.PORT || 5000
  
app.use('/user', userHandler) 
app.use('/family',authenticateToken,familyHandler) 
app.use('/role',authenticateToken,roleHandler)
app.use("/hobby",authenticateToken,hobbyHandler)
app.use("/task",authenticateToken,taskHandler)


app.listen(port,()=>console.log(`app is running on port ${port}`))

  