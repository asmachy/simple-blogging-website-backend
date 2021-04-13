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
                res.status(201).json(nUser);
            }
            
        } catch(err){
            res.status(400).send({message: err});
        }
    },
    login: async(req, res, next) =>{
        try{
            const user = await userService.getUserByEmail(req.body.email);    
            const f= await bcryptjs.compare(req.body.password, user.password);
            if(f){
                const token = jwt.sign({email: user.email},process.env.jwtSecret,{expiresIn: '1d'});
                res.status(200).json({message: "Login Successful!",
                          token  });
            }
            else {
                res.status(401).send({message: "Email and Password Did not Match!"});
            }

        } catch(err){
            res.status(400).send({message: err});
        }
    }

}  