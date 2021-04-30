const express = require('express');
const postService = require("../services/post.service");
const mongoose = require('mongoose');

async function isValidAuthor(author,req,res,next){
    try{
        post = await postService.getPostById(req.params.id);
        if(post==null){
            res.status(410)
            return res.send({message: 'Post not Found'});
        }
        if(post.author_email!=author.email){
            res.status(403);
            return res.send({message: "Access Denied!!"});
        } 
        else return next(post);
    } catch(err){
        res.status(404);
        return res.send({message: err});
    }
    
}

async function isValidPostId(req,res,next ){
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            res.status(404);
            return res.send({message: "Invalid Post Id"});
        }
        else return next();
    } catch(err){
        res.status(400);
        return res.send(err);
    }
}
async function isValidNewPostFormat(req,res,next ){
    try{
        if(req.body.title==null || req.body.body==null || Object.keys(req.body).length!=2){
            res.status(400);
            return res.send({message: "Incorrect Post Format",
                            correctFormat: {
                                title: "",
                                body: ""
            }});
        }
        else next();
    } catch(err){
        res.status(400);
        return res.send(err);
    }
    
}

module.exports = {
    isValidAuthor,
    isValidPostId,
    isValidNewPostFormat
}