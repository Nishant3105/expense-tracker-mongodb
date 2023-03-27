const Expense = require('../model/expense')
const User = require('../model/user')
const FilesDownloaded=require('../model/filedownloaded')
const S3Service=require('../services/s3services')

exports.downloadexpense = async (req, res) => {
    try{
        const Expenses= await Expense.find({userId:req.user._id});
        const  stringifiedExpenses=JSON.stringify(Expenses);
        const userId= req.user._id;
        const fileName=`Expenses${userId}/${new Date()}.txt`;
        const fileURL= await uploadToS3(stringifiedExpenses,fileName);
        const downloadfile=new  FilesDownloaded({url:fileURL,userId:req.user._id});
        await downloadfile.save();
    
        res.status(200).json({fileURL,success:true})
    } catch (err) {
      console.log(err)
      res.status(500).json({ fileURL: "", success: false, error: err });
    }
  }


exports.addExpense = async (req, res, next) => {
    try {
        const { expenseprice, description, typeofexpense } = req.body
        if (expenseprice == "" || description == "" || typeofexpense == "") {
            res.status(400).json({ message: 'Please fill all the details' })
        }
        console.log(req.user)
        const expense = new Expense({
            expenseprice,
            description,
            typeofexpense,
            userId: req.user._id
        })
        await expense.save()
        
        const totalExpense = Number(req.user.totalexpense) + Number(expenseprice)
        
        await User.findById(req.user._id).then(user=>{
            console.log(user)
            user.totalexpense=totalExpense
            user.save()
        })


        res.status(200).json(expense)

    }
    catch (err) {
        console.log(err)
        res.status(500).json({ success: false })
    }

}


exports.getExpense = async (req, res, next) => {
    try {
        //req.user.getExpense().then.....
        const uId=req.user.id
        console.log(req.query)
        const limit=req.query.limit ? parseInt(req.query.limit) : 2
        const page=req.query.page ? parseInt(req.query.page) : 1
        // Expense.findAndCountAll({ where: { userId: uId } })
        //     .then(data => {
        //         const pages=Math.ceil(data.count / limit)
        //         req.user.getExpenses({attributes:['expenseprice','description','typeofexpense'],offset: (page-1) * limit, limit:limit})
        //         .then((expense)=>{
        //             console.log(expense)
        //             res.status(200).json({expense, pages:pages})
        //         })
        //         .catch((err)=>console.log(err))
        //     })
        //     .catch((err)=>console.log(err))
        const total  = await Expense.count({userId:req.user._id})
        const pages=Math.ceil(total / limit)
       const expense =await Expense.find({userId:req.user._id}).
        skip((page-1)*limit).
        limit(limit)
        res.status(200).json({expense, pages:pages})
    }
    catch (err) {
        res.status(500).json({ error: err ,success: false })
    }
}

exports.deleteExpense = async (req, res, next) => {
    try {
        const id = req.params.id
        const expense = await Expense.findOne({_id: id })
        const expamt = expense.expenseprice
        console.log(expamt)
        await Expense.findByIdAndRemove({_id:expense._id})
        
        const totalExpense = Number(req.user.totalexpense) - Number(expamt)

        await User.findById(req.user._id).then(user=>{
            console.log(user)
            user.totalexpense=totalExpense
            user.save()
        })

        res.json({ message: 'expense deleted successfully!' })
        
        // const response = await Expense.destroy({ where: { id } })
        // if (response == true) {
        //     await User.update({
        //         totalexpense: totalExpense
        //     }, {
        //         where: { id: req.user.id }
        //     })
        // }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Something went wrong' })
    }
}