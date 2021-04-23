const express = require('express');
const jwt = require('jsonwebtoken');
const PostService = require("../services/post.service");
const postService = new PostService();
const UserService = require("../services/user.service");
const userService = new UserService();
const mongoose = require('mongoose');
const controllerHelper = require('../helper/controller.helper');
module.exports = {
    getPost: async(req,res,next) =>{
        try{
            await mongoose.Types.ObjectId.isValid(req.params.id);
            const post = await postService.getPostById(req.params.id);
            if(post==null){
                res.status(404).send({message: "Post Not Found"});    
            }
            let resBody = await controllerHelper.convertPostsToDesiredType(req.header('Accept'), [post]);
            return res.status(200).send(resBody);
        } catch(err){
            res.status(400).send(err);
        }
    },
    getPosts: async(req, res, next) => {
        try{
            const posts = await postService.getAllPost();
            let resBody = await controllerHelper.convertPostsToDesiredType(req.header('Accept'), posts);
            return res.status(200).send(resBody);
        } catch(err){
            console.log(err);
            res.status(400).send({message: err});
        }    
    },
    createPost: async(user,req,res,next) => {
        try{
            const msg = await postService.createNewPost(req.body, user.fullname, user.email);
            console.log(msg);
            return res.status(201).send({message: msg});
        } catch(err){
            console.log(err);
            res.status(400).send({message: err.message});
            return;
        }
    },
    updatePost: async(post, req, res, next) => {
        try{
            post = await controllerHelper.updatePostContent(req.body, post);
            const msg = await postService.updatePostById(req.params.id, post);
            let resBody = await controllerHelper.convertPostsToDesiredType(req.header('Accept'), [post]);
            return res.status(201).send({message: msg, resBody});
        } catch(err){
            console.log(err);
            return res.status(400).send({message: err});
        }
    },
    deletePost: async(post,req, res, next) => {
        try{
            const msg = await postService.deletePostById(req.params.id);
            return res.status(200).send({message: msg});
        } catch(err){
            console.log(err);
            return res.status(400).send({message: err});
        }
    }   
}