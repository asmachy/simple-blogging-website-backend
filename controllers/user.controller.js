const express = require('express');
const UserService = require("../services/user.service");
const userService = new UserService();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
module.exports = {
    
    createUser: async(req, res, next) => {
        try{
            const user = await userService.getUserByEmail(req.body.email);
            if(user){
                res.send("Email Already Exists.. Please Login.");
            }
            else{
                const nUser = await userService.createNewUser(req.body);
                res.json(nUser);
            }
            
        } catch(err){
            res.send("Oops! Error: "+err);
        }
    },
    login: async(req, res, next) =>{
        try{
            const user = await userService.getUserByEmail(req.body.email);
            if(user === null){
                res.send("User Not Found!");
            }
            else{
                const f= await bcryptjs.compare(req.body.password, user.password);
                if(f){
                    const token = jwt.sign({email: user.email},process.env.jwtSecret,{expiresIn: '1d'});
                    res.json({message: "Login Successful!",
                              token  });
                }
                else {
                    res.send("Email and Password Did not Match!");
                }
            }

        } catch(err){
            res.send("Oops! Error: "+err);
        }
    },
    getUsers: async(req, res, next) => {
        try{
            const users = await userService.getAllUser();
            res.json(users); 
        } catch(err){
            res.send("Oops! Error: "+err);
        }
        
    }

}  