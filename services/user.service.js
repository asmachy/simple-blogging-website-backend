const User = require('../models/user.model');
const bcryptjs = require("bcryptjs");

async function createNewUser(reqBody){
    try{
        let hashedpassword="";
        hashedpassword = await bcryptjs.hash(reqBody.password, 10);
        const user = new User({
        fullname: reqBody.fullname,
        email: reqBody.email,
        password: hashedpassword
        });
        await user.save();
        return {data: 'Registration Successful!', status: 201};
    } catch(err){
        return {data: err.message, status: 500};
    }
}
async function getAllUser() {
    try{
        const users = await User.find();
        return {data: users, status: 200};
    } catch(err){
        // return {data: 'server failed', status: 500};
        return {data: err.message, status: 500};
    }
}

async function getUserByEmail(email){
    try{
        const user = await User.findOne({email:email});
        return {data: user, status: 200};

    } catch(err){
        return {data: err.message, status: 500};
    }
}

module.exports = {
    createNewUser,
    getAllUser,
    getUserByEmail
}