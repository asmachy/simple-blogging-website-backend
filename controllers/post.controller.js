const express = require('express');
const jwt = require('jsonwebtoken');
const PostService = require("../services/post.service");
const postService = new PostService();
const UserService = require("../services/user.service");
const logicHelper = require("../helper/logicHelper");
const userService = new UserService();
const mongoose = require('mongoose');

module.exports = {
    getPost: async(req,res,next) =>{
        try{
            await mongoose.Types.ObjectId.isValid(req.params.id);
            const fileType = req.header('accept');
            const post = await postService.getPostById(req.params.id);
            let resBody = await logicHelper.convertPostsToDesiredType(fileType, [post]);
            return res.status(200).send(resBody);

        } catch(err){
            res.status(400).send({message: err});
        }

    },
    getPosts: async(req, res, next) => {
        try{
            const fileType = req.header('accept');
            const posts = await postService.getAllPost();
            let resBody = await logicHelper.convertPostsToDesiredType(fileType, posts);
            return res.status(200).send(resBody);
        } catch(err){
            res.status(400).send({message: err});
        }
        
    },
    createPost: async(req, res, next) => {
        try{
            const user = await logicHelper.authentication(req.header('authorization'));
            const newPost = await postService.createNewPost(req.body, user.fullname, user.email);
            return res.status(201).send({message: "Post Created",
                        newPost});
        } catch(err){
            res.status(400).send({message: err});
        }
    },
    updatePost: async(req, res, next) => {
        try{
            await mongoose.Types.ObjectId.isValid(req.params.id);
            const user = await logicHelper.authentication(req.header('authorization'));
            let post= await postService.getPostById(req.params.id);
            post = await logicHelper.updatePostContent(req.body, post);
            const validationOfUser = await logicHelper.isValidUser(post, user.email);
            if(validationOfUser===true) {
                await postService.updatePostById(req.params.id, post);
                const fileType = req.header('accept');
                let resBody = await logicHelper.convertPostsToDesiredType(fileType, [post]);
                return res.status(200).send(resBody);
            }
            else{
                res.status(401).send({message: "Access Denied!!!"});
            }
            
        } catch(err){
            res.status(400).send({message: err});
        }
    },
    deletePost: async(req, res, next) => {
        try{
            mongoose.Types.ObjectId.isValid(req.params.id);
            const user = await logicHelper.authentication(req.header('authorization'));
            const post= await postService.getPostById(req.params.id);
            const validationOfUser = await logicHelper.isValidUser(post, user.email);
            if(validationOfUser === true) {
                const deletePost = await postService.deletePostById(req.params.id);
                res.status(204).send({message: deletePost});
            } else res.status(401).send({message: "Access Denied!!!"});
        } catch(err){
            res.status(400).send({message: err});
        }
    }   
}