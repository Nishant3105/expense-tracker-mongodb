const mongoose=require('mongoose')
const Schema=mongoose.Schema

const expenseSchema=new Schema({
    expenseprice: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    typeofexpense: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref:'User'
    }
    
})

module.exports = mongoose.model('Expense', expenseSchema)

// const Sequelize=require('sequelize')

// const sequelize=require('../util/database')

// const Expense=sequelize.define('expense',{
//     id: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     expenseprice:{
//         type: Sequelize.DOUBLE,
//         allowNull: false
//     },
//     description:{
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     typeofexpense:{
//         type: Sequelize.STRING,
//         allowNull: false
//     }

// })

// module.exports=Expense