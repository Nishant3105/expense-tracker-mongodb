const uuid = require("uuid");
const Sib = require("sib-api-v3-sdk");
require("dotenv").config();
const bcrypt = require("bcrypt");

const User = require("../model/user");
const Forgotpassword = require("../model/forgotpassword");

exports.forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user) {
      const id = uuid.v4();
      const forgotPassword = new Forgotpassword({ id: id, isactive: true, userId: user._id })
      await forgotPassword.save()

      const client = Sib.ApiClient.instance;

      const apiKey = client.authentications["api-key"];
      apiKey.apiKey = process.env.API_KEY;

      const tranEmailApi = new Sib.TransactionalEmailsApi();
      const sender = {
        email: "nishantkumar2522@gmail.com",
        name: "Nishant",
      };

      const receivers = [
        {
          email: email,
        },
      ];

      tranEmailApi
        .sendTransacEmail({
          sender,
          to: receivers,
          subject: "Send a reset password mail",
          textContent: "I will teach you how to reset a password",
          htmlContent: `<a href="http://localhost:4000/password/resetpassword/${id}">Reset password</a>`,
        })
        .then((response) => {
          // console.log(response[0].statusCode)
          // console.log(response[0].headers)
          return res.status(204).json({
            message: "Link to reset password sent to your mail ",
            sucess: true,
          });
        })
        .catch((err) => {
          throw new Error(err);
        });

    } else {
      throw new Error("User doesnt exist");
    }
  } catch (err) {
    console.error(err);
    return res.json({ message: err, sucess: false });
  }
};

exports.resetpassword = async (req, res) => {
  try {
    const id = req.params.id;
    const forgotpasswordrequest = await Forgotpassword.findOne({ id: id })

    if (forgotpasswordrequest) {
      await forgotpasswordrequest.updateOne({ isactive: false })
      res.status(200).send(`<html>
                                  <script>
                                      function formsubmitted(e){
                                          e.preventDefault();
                                          console.log('called')
                                      }
                                  </script>
                                  <form action="/password/updatepassword/${id}" method="get">
                                      <label for="newpassword">Enter New password</label>
                                      <input name="newpassword" type="password" required></input>
                                      <button>reset password</button>
                                  </form>
                              </html>`);
      res.end();
    }
    else {
      throw new Error("invalid uuid")
    }
  }
  catch (err) {
    /*  console.log(err); */
    res.status(500).json({ message: err, success: false })
  }
}


exports.updatepassword = async (req, res) => {
  try {
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;

    const resetpasswordrequest = await Forgotpassword.findOne({ id: resetpasswordid })
    const user = await User.findOne({ _id: resetpasswordrequest.userId })

    // console.log('userDetails', user)
    if (user) {
      //encrypt the password

      const saltRounds = 10;
      bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) {
          console.log(err);
          throw new Error(err);
        }
        bcrypt.hash(newpassword, salt, function (err, hash) {
          // Store hash in your password DB.
          if (err) {
            console.log(err);
            throw new Error(err);
          }
          User.updateOne({ _id: user._id }, { password: hash }).then(() => {
            res.status(201).json({ message: 'Successfuly updated the new password' })
          }).catch((err) => {
            return res.status(500).json({ message: err })
          })
        });
      });
    } else {
      return res
        .status(404)
        .json({ error: "No user Exists", success: false });
    }
  } catch (error) {
    return res.status(403).json({ error, success: false });
  }
};


