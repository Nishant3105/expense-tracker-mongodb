const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const downloadSchema=new Schema({
    url:{
        type:String,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
})
module.exports=mongoose.model('DownlodedFile',downloadSchema);


// const Sequelize=require('sequelize')

// const sequelize=require('../util/database')

// const FilesDownloaded=sequelize.define('filesdownloaded',{
//     id: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     fileUrl:{
//         type: Sequelize.STRING,
//         allowNull: false
//     }

// })


// module.exports=FilesDownloaded