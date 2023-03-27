const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const mongoose=require('mongoose')

const jwt=require('jsonwebtoken')

const dotenv = require("dotenv")

dotenv.config();


const userroutes = require('./routes/userRoutes')
const exproutes = require('./routes/expenseRoutes')
const purchaseroutes = require('./routes/purchaseRoutes')
const premiumroutes = require('./routes/premiumRoutes')
const fproutes = require('./routes/forgotpassword')

const Expense=require('./model/expense')
const User=require('./model/user')
const Order=require('./model/order')
const Forgotpassword=require('./model/forgotpassword')
const FilesDownloaded=require('./model/filedownloaded')


const app = express()


app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(userroutes)

app.use(exproutes)

app.use(purchaseroutes)

app.use(premiumroutes)

app.use(fproutes)


mongoose.connect('mongodb+srv://a2Fxd0uPKsyMON95:a2Fxd0uPKsyMON95@cluster0.q69fezb.mongodb.net/expensetracker?retryWrites=true&w=majority')
.then(result=>{
    app.listen(4000)
})
.catch(err=>{
    console.log(err)
})

