const express = require('express');
const userService =  require("../services/user.service");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Cookie } = require('express-session');
module.exports = {
    
    createUser: async(req, res, next) => {
        try{
            const user = await userService.getUserByEmail(req.body.email);
            if(user){
                return res.send("Email Already Exists.. Please Login.");
            }
            else{
                const msg = await userService.createNewUser(req.body);
                return res.status(201).send({message: msg});
            }
            
        } catch(err){
            res.status(400).send({message: err});
        }
    },
    login: async(req, res, next) =>{
        try{
            const user = await userService.getUserByEmail(req.body.email);    
            let f=false;
            if(user!=null) f= await bcryptjs.compare(req.body.password, user.password);
            if(f){
                const token = jwt.sign({email: user.email},process.env.jwtSecret,{expiresIn: '1d'});
                // res.cookie('Authentication-token') = token;
                // console.log(res);
                return res.status(200).json({message: "Login Successful!",
                          token  });
            }
            else {
                return res.status(401).send({message: "Incorrect email or password"});
            }

        } catch(err){
            return res.status(400).send({message: err.message});
        }
    }
}  