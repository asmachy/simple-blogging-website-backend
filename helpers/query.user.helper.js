const express = require('express');
const jwt = require('jsonwebtoken');
const userService = require("../services/user.service");
async function tokenValidation(token){
    try{
        let userInfo = jwt.verify(token,process.env.jwtSecret);
        let user = await userService.getUserByEmail(userInfo.email);
        
        return user;

    } catch(err){
        return 'not verified token';
    }
    
}

async function isLoggedIn (req,res,next){
    try{
        let token = req.header('authorization');
        token = await token.substring(7, token.length);
        const user = await this.tokenValidation(token);

        if(!user) {
            res.status(410);
            return res.send({message: 'User does not exist anymore. Please register.'})
        }
        else if(user=='not verified token'){
            res.status(401);
            return res.send({message: 'Please login and use correct token'});
        }
        else return next(user);
        
    } catch(err){
        res.status(401);
        return res.send({message: 'Please login and use correct token'});
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
            next();
            return;
        }
    } catch(err){
        return res.status(400).send(err);
    }
    
}

async function isValidRegistrationFormat(req,res,next ){
    try{

        if(req.body.email==null || req.body.password==null ||req.body.fullname==null || Object.keys(req.body).length!=3){
            res.status(400);
            return res.send({message: "Incorrect register format",
                    correctFormat: {
                    fullname: "",
                    email: "",
                    password: ""
            }});
        }
        else return next();
    } catch(err){
        res.status(400);
        return res.send(err.message);
    }
    
}

module.exports = {
    tokenValidation,
    isLoggedIn,
    isValidLoginFormat,
    isValidRegistrationFormat
}