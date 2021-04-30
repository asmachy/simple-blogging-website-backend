const User = require('../models/user.model');
const bcryptjs = require("bcryptjs");

async function createNewUser(reqBody){
    try{
        let hashedpassword="";
        if(reqBody.password!="")
            hashedpassword = await bcryptjs.hash(reqBody.password, 10);
        const user = new User({
        fullname: reqBody.fullname,
        email: reqBody.email,
        password: hashedpassword
        });
        const user1= await user.save();
        return "Registration Successfull";
    } catch(err){
        return err.message;
    }
}
async function getAllUser() {
    try{
        const users = await User.find();
        return users;
    } catch(err){
        return err.message;
    }
}

async function getUserByEmail(email){
    try{
        console.log("email: ",email);
        const user = await User.findOne({email:email});
        console.log("user from user service: ", user);
        return user;
        // return Promise.resolve(user);
    } catch(err){
        console.log('err from user service: ', err.message);
        return null;
        // return Promise.reject(null);
    }
}

module.exports = {
    createNewUser,
    getAllUser,
    getUserByEmail
}