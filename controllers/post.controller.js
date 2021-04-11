const express = require('express');
const jwt = require('jsonwebtoken');
const PostService = require("../services/post.service");
const postService = new PostService();
const UserService = require("../services/user.service");
const userService = new UserService();
const mongoose = require('mongoose');

async function tokenValidation(token){
    try{
        const verified = jwt.verify(token,process.env.jwtSecret);
        let user = verified;
        user = await userService.getUserByEmail(user.email);
        return user;
    } catch{
        return "Invalid Token";
    }
}

async function authentication (authorizationHeader){
    try{ 
        const bearerToken = authorizationHeader;
        if(!bearerToken){
            return "Please Login and Use Token";
        }
        else{
            const token = await bearerToken.substring(7, bearerToken.length);
            const message = await tokenValidation(token);
            return message;
        }
    } catch(err){
        return err;
    }
    
}
async function isValidUser(post, author_email ){
    if(post.author_email!=author_email) return false;
    else return true;
}


module.exports = {
    getPost: async(req,res,next) =>{
        try{
            if(!mongoose.Types.ObjectId.isValid(req.params.id)){
                res.status(404).send("Post Not found! Invalid Post ID.");
            }
            else{
                const post = await postService.getPostById(req.params.id);
                if(post!=null){
                    const fileType = req.header('accept');
                    if(fileType==='application/html'){
                        const htmlPost = "<div><h1>"+post.title+"<br><br></h1><h2>"+post.body+"<br><br></h2>"+"<h2>Author:  "+post.author+"</h2></div>";
                        res.send(htmlPost);
                    }
                    else res.json(post);
                }
                else res.status(200).send("Post Not Found! The post is probably moved or deleted.."); 
            }
            
            
        } catch(err){
            res.status(500).send(err);
        }

    },
    getPosts: async(req, res, next) => {
        try{
            const posts = await postService.getAllPost();

            const fileType = req.header('accept');
            if(fileType==='application/html'){
                let htmlPost="<div>";
                posts.forEach(function(element) {
                    htmlPost+= "<div><h1>"+element.title+"<br></h1><h2>"+element.body+"<br></h2><h2>Author: "+element.author+"<br><br></h2></div>";
                 });
                 htmlPost+= "</div>";
                res.send(htmlPost);
            }
            else
                res.json(posts); 
        } catch(err){
            res.send("Oops! Error: "+err);
        }
        
    },
    createPost: async(req, res, next) => {
        try{
            const user = await authentication(req.header('authorization'));
            if(user.email!=null){
                const nPost = await postService.createNewPost(req.body, user);
                res.send("Post Created");
            }
            else{
                res.send(user);
            }
            
        } catch(err){
            res.send("Oops! Error: "+err);
        }
    },
    updatePost: async(req, res, next) => {
        try{
            if(!mongoose.Types.ObjectId.isValid(req.params.id)){
                res.status(404).send("Post Not found! Invalid Post ID.");
            }
            else{
                const user = await authentication(req.header('authorization'));
                if(user.email!=null){
                    const post= await postService.getPostById(req.params.id);

                    if(post!=null){
                        if(req.body.title!=null)  post.title = req.body.title;
                        if(req.body.body!=null)  post.body = req.body.body;
                        const validationOfUser = await isValidUser(post, user.email);
                        if(validationOfUser) {
                            await postService.updatePostById(req.params.id, post);
                            const fileType = req.header('accept');
                            if(fileType==='application/html'){
                                const htmlPost = "<div><h1>"+post.title+"<br><br></h1><h2>"+post.body+"<br><br></h2>"+"<h2>Author:  "+post.author+"</h2></div>";
                                res.send(htmlPost);
                            } else res.json(post);
                        }
                        else{
                            res.send("Access Denied!!!");
                        }
                    }
                    else res.status(200).send("Post Not Found! The post is probably moved or deleted..");     
                }
                else  res.send(user);
            }
            
            
            
        } catch(err){
            res.send("Oops! Error: "+err);
        }
    },
    deletePost: async(req, res, next) => {
        try{
            if(!mongoose.Types.ObjectId.isValid(req.params.id)){
                res.status(404).send("Post Not found! Invalid Post ID.");
            }
            else{
                const user = await authentication(req.header('authorization'));
                if(user.email!=null){
                    const post= await postService.getPostById(req.params.id);
                    const validationOfUser = await isValidUser(post, user.email);
                    if(validationOfUser) {
                        const deletePost = await postService.deletePostById(req.params.id);
                        res.send(deletePost);
                    } else res.send("Access Denied!!!");
                }
                else{
                    res.send(user);
                }            
            }
        } catch(err){
            res.send("Oops! Error: "+err);
        }
    }   
}