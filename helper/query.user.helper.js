const express = require('express');
const jwt = require('jsonwebtoken');
const PostService = require("../services/post.service");
const postService = new PostService();
const UserService = require("../services/user.service");
const userService = new UserService();
const mongoose = require('mongoose');
const { collection } = require('../models/post.model');

async function tokenValidation(token, res){
    try{
        // let user= null;
        let user = jwt.verify(token,process.env.jwtSecret);
        user = await userService.getUserByEmail(user.email);
        if(!user){
            res.status(401);
            return res.send({message: "Please login and use correct token"});
        }
        return user;
    } catch(err){
        res.status(401);
        return res.send({message: "Please login and use correct token"});
        // return null;
    }
}

async function isLoggedIn (req,res,next){
    try{
        let token = req.header('authorization');
        token = await token.substring(7, token.length);
        const user = await tokenValidation(token, res);
        if(!user) return;
        return next(user);
        
    } catch(err){
        res.status(401);
        return res.send({message: "Please login and use correct token"});
    }
    
}

async function isValidUserInfo(req,res,next ){
    try{
        if(req.body.email==null || req.body.password==null || Object.keys(req.body).length!=2) {
            res.status(400);
            return res.send({message: "Incorrect login format",
                        correctFormat: {
                        email: "",
                        password: ""
            }});
        }
        else next();
    } catch(err){
        return res.status(400).send(err);
    }
    
}

async function isValidNewUserInfo(req,res,next ){
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
        else next();
    } catch(err){
        res.status(400);
        return res.send(err.message);
    }
    
}


module.exports = {
    tokenValidation,
    isLoggedIn,
    isValidUserInfo,
    isValidNewUserInfo
}