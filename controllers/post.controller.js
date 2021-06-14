const express = require('express');
const jwt = require('jsonwebtoken');
const postService = require("../services/post.service");
const mongoose = require('mongoose');
const controllerHelper = require('../helpers/controller.helper');
module.exports = {
    getPost: async(req,res,next) =>{
        try{
            const post = await postService.getPostById(req.params.id);
            if(post.data==null){
                res.status(410);
                return res.send('Post not Found');    
            }
            let resBody = post.data;
            if(post.status!=500)
            resBody= await controllerHelper.convertPostsToDesiredType(req.header('Accept'), [post.data]);
            res.status(post.status);
            return res.send(resBody);
        } catch(err){
            res.status(400);
            return res.send(err.message);
        }
    },
    getPosts: async(req, res, next) => {
        try{
            const posts = await postService.getAllPost();
            posts.data.sort(function(a, b){return b.createdAt - a.createdAt});
            let resBody = posts.data;
            if(posts.status!= 500)
            resBody = await controllerHelper.convertPostsToDesiredType(req.header('Accept'), posts.data);

            res.status(posts.status);
            return res.send(resBody);
        } catch(err){
            res.status(400);
            return res.send(err.message);
        }    
    },
    createPost: async(user,req,res,next) => {
        try{
            const msg = await postService.createNewPost(req.body, user.fullname, user.email);
            res.status(msg.status);
            return res.send(msg.data);
        } catch(err){
            res.status(400);
            return res.send(err.message);
            
        }
    },
    updatePost: async(post, req, res, next) => {
        try{
            post = await controllerHelper.updatePostContent(req.body, post);
            const msg = await postService.updatePostById(req.params.id, post);
            let resBody = '';
            if(msg.status!=500)
            resBody = await controllerHelper.convertPostsToDesiredType(req.header('Accept'), [post]);
            res.status(msg.status);
            return res.send({message: msg.data, post: resBody});
        } catch(err){
            res.status(400);
            return res.send(err.message);
        }
    },
    deletePost: async(post,req, res, next) => {
        try{
            const msg = await postService.deletePostById(req.params.id);
            res.status(msg.status);
            return res.send(msg.data);
        } catch(err){
            res.status(400);
            return res.send(err.message);
        }
    }   
}