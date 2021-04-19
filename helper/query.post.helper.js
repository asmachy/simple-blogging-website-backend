const express = require('express');
const jwt = require('jsonwebtoken');
const PostService = require("../services/post.service");
const postService = new PostService();
const UserService = require("../services/user.service");
const userService = new UserService();
const mongoose = require('mongoose');

async function isValidAuthor(author,req,res,next){
    try{
        post = await postService.getPostById(req.params.id);
        if(post==null){
            const err= "Post not Found";
            throw(err);
        }
        if(post.author_email!=author.email) return res.status(403).send({message: "Access Denied!!"});
        else return next(post);
    } catch(err){
        console.log(err);
        return res.status(404).send({message: err});
    }
    
}

async function isValidPostId(req,res,next ){
    try{
        if(!await mongoose.Types.ObjectId.isValid(req.params.id)) 
        return res.status(404).send({message: "Invalid Post Id"});
        else next();
    } catch(err){
        return res.status(400).send(err);
    }
    
}

async function isValidNewPostInfo(req,res,next ){
    try{
        if(req.body.title==null || req.body.body==null || Object.keys(req.body).length!=2) 
        return res.status(400).send({message: "Incorrect Post Format",
                                    correctFormat: {
                                        title: "",
                                        body: ""
                                    }});
        else next();
    } catch(err){
        return res.status(400).send(err);
    }
    
}

module.exports = {
    isValidAuthor,
    isValidPostId,
    isValidNewPostInfo
}