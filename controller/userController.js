const User = require('../model/user')

const bcrypt = require('bcrypt')

const jwt=require('jsonwebtoken')

function generateAccessToken(id,name,ispremiumuser){
    return jwt.sign({userId:id,username:name,ispremiumuser},'secretkey')
}

const postUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body
        if (name == "" || email == "" || password == "") {
            res.status(500).send('please fill all the details')
        }
        bcrypt.hash(password, 10, async (err, hash) => {
            const user=new User({
                username: name,
                email,
                password: hash,
                ispremiumuser: false,
                totalexpense: 0
            })
            await user.save()
            .then(result=>{
            res.status(201).json({ message: 'Successfully created new user' })

            })
            .catch(err=>{
                console.log(err)
            })

        })
    }
    catch (err) {
        console.log(err)
    }
}

const userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body
        console.log(email, password)
        if (email == "" || password == "") {
            res.status(400).json({ message: 'please fill all the details', success: false })
        }
        const user = await User.findOne({email:email})

        console.log(user)
        if (user) {
            bcrypt.compare(password, user.password, (err, response) => {
                if (err) {
                    throw new Error('Something went wrong!')
                }
                if (response === true) {
                    res.status(200).json({ 
                        success: true, 
                        message: "User logged in successfully",
                        token: generateAccessToken(user._id,user.username,user.ispremiumuser) 
                    })
                }
                else {
                    res.status(400).json({ success: true, message: "Password is incorrect" })
                }
            })
        } else {
            res.status(404).json({ success: true, message: "User doesn't exist" })
        }

    }
    catch (err) {
        res.status(404).json('SORRY! user not found!')
    }
}

module.exports = {postUser,
                 generateAccessToken,
                 userLogin
                }

  
  