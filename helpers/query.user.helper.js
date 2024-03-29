const jwt = require('jsonwebtoken');
const userService = require("../services/user.service");
const express = require('express');
// const self= this;

tokenValidation = async (token)=>{
    try{
        token = await token.substring(7, token.length);
        let userInfo = jwt.verify(token,process.env.jwtSecret);
        let user = await userService.getUserByEmail(userInfo.email);
        return user.data;

    } catch(err){
        return 'not verified token';
    }
    
}
async function isLoggedIn (req,res,next){
    try{
        let token = req.header('authorization');
        const user = await this.tokenValidation(token);
        if(!user) {
            res.status(410);
            return res.send('User does not exist anymore. Please register.');
        }
        else if(user=='not verified token'){
            res.status(401);
            return res.send('Please login and use correct token');
        }
        else if(user.email!=null){
            return next(user);
        }
        else {
            res.status(500);
            return res.send('server failed');
        }
        
    } catch(err){
        res.status(400);
        return res.send(err.message);
    }
    
}

async function isValidLoginFormat(req,res,next ){
    try{
        if(req.body.email==null || req.body.password==null || Object.keys(req.body).length!=2) {            
            res.status(400);
            return res.send({message: "Incorrect login format",
                correctFormat: {
                    email: "",
                    password: ""
            }});
        }
        else {
            return next();
        }
    }catch(err){
        res.status(400);
        return res.send(err.message);
    }
    
}

async function isValidRegistrationFormat(req,res,next ){
    try{
        if(!req.body.fullname){
            res.status(400);
            return res.send("Invalid name of user");
        }

        if(!req.body.email){
            res.status(400);
            return res.send("Invalid email address");
        }

        if(!req.body.password){
            res.status(400);
            return res.send("invalid type of password");
        }

        if(Object.keys(req.body).length!=3){
            res.status(400);
            return res.send("Suspicious value detected");
        }
        
        // if(!req.body.email|| !req.body.password ||!req.body.fullname || Object.keys(req.body).length!=3){
            
            
        //     return res.send({message: "Incorrect register format",
        //     correctFormat: {
        //         fullname: "",
        //         email: "",
        //         password: ""
        //     }});
        // }
        return next();

    }catch(err){
        res.status(400);
        // console.log('from helper', err.message);
        return res.send(err.message);
    }

    
}

module.exports = {

    tokenValidation,
    isValidLoginFormat,
    isLoggedIn,
    isValidRegistrationFormat
}