const express = require('express');
const userService =  require("../services/user.service");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Cookie } = require('express-session');
module.exports = {
    
    createUser: async(req, res, next) => {
        try{
            const user = await userService.getUserByEmail(req.body.email);
            if(user.data!= null && user.status!=500){
                res.status(409);
                return res.send('Email Already Exists.. Please Login.');
            }
            else if(user.status==500){
                res.status(user.status);
                return res.send(user.data);
            }
            else{
                const msg = await userService.createNewUser(req.body);
                res.status(msg.status);
                return res.send(msg.data);
            }
            
        } catch(err){
            res.status(400);
            return res.send(err.message);
        }
    },
    login: async(req, res, next) =>{
        try{
            const user = await userService.getUserByEmail(req.body.email);    
            let f=false;
            if(user.status==500){
                res.status(user.status);
                return res.send(user.data);
            }
            
            if(user.data!=null) f= await bcryptjs.compare(req.body.password, user.data.password);
            if(f){
                const token = jwt.sign({email: user.data.email},process.env.jwtSecret,{expiresIn: '1d'});    
                res.status(200)
                return res.json({message: "Login Successful!",
                fullname: user.data.fullname,
                email: user.data.email,
                token: token});
            }
            else {
                res.status(401)
                return res.send('Incorrect email or password');
            }

        } catch(err){
            res.status(400);
            return res.send(err.message);
        }
    },
    loginByToken: async(user, req, res, next)=>{
        res.status(200);
        return res.send(user.email);
        
    }

}  