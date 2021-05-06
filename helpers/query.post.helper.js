const express = require('express');
const postService = require("../services/post.service");
const mongoose = require('mongoose');

async function isValidAuthor(author,req,res,next){
    try{
        post = await postService.getPostById(req.params.id);
        if(post.status==500){
            res.status(post.status)
            return res.send('Server is not responding. Please try again later');
        }
        else if(post.data==null){
            res.status(410)
            return res.send('Post not Found');
        }
        else if(post.data.author_email!=author.email){
            res.status(403);
            return res.send('Access Denied!!');
        } 
        else return next(post.data);
    } catch(err){
        res.status(400);
        return res.send(err.message);
    }
    
}

async function isValidPostId(req,res,next ){
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            res.status(404);
            return res.send('Invalid Post Id');
        }
        else return next();
    } catch(err){
        res.status(400);
        return res.send(err.message);
    }
}
async function isValidNewPostFormat(req,res,next ){
    if(req.body.title==null || req.body.body==null || Object.keys(req.body).length!=2){
        res.status(400);
        return res.send({message: "Incorrect Post Format",
                correctFormat: {
                    title: "",
                    body: ""
        }});
    }
    else next();
}

module.exports = {
    isValidAuthor,
    isValidPostId,
    isValidNewPostFormat
}