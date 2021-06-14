const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const should = require('should');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const sandbox = sinon.createSandbox();

// const postController = require('../../../controllers/post.controller');
const Post = require('../../../models/post.model');
const postService = require('../../../services/post.service');
const { Mongoose } = require('mongoose');
// const controllerHelper = require('../../../helpers/controller.helper');
// const { response } = require('express');
describe('Post Service Unit Tests: ',() =>{
    let reqBody, expectedValue, post, posts, user, returnedValue;
    describe('Get ALL Post', () =>{
        beforeEach( ()=> {
            sandbox.restore();
        });
        it('should return status 200 for successfull database operation', async ()=>{
            posts = [{title: 'first post'},{title:'second post'}]
            expectedValue = {data: posts, status: 200}; 
            sandbox.stub(Post, 'find')
            .returns(posts);
            returnedValue = await postService.getAllPost();
            expect(returnedValue).to.be.eql(expectedValue);
        });

        it('should return 500 for server error', async ()=>{
            err = {message: 'server failed'};
            sandbox.stub(Post, 'find')
            .throws(err);
            expectedValue = {data: err.message, status: 500};
            returnedValue = await postService.getAllPost();
            expect(returnedValue.status).to.be.eql(expectedValue.status);
        });

        afterEach( ()=> {
            sandbox.restore();
        });
            
    });

    describe('Get Post By Id', () =>{
        post = {title: 'post'}, id = 'post id';
        it('should return status 200 for successful server operation', async ()=>{
            post = {title: 'post2'}, id = 'post id';
            sandbox.stub(Post, 'findById')
            .returns(post);
            expectedValue = {data: post, status: 200};
            returnedValue=await postService.getPostById(id);
            expect(returnedValue).to.be.eql(expectedValue);
        });
        it('should return 500 for server error', async ()=>{
            err = {message: 'server failed'};
            sandbox.stub(Post, 'findById')
            .throws(err);
            expectedValue = {data: err.message, status: 500};
            returnedValue = await postService.getPostById(id);
            expect(returnedValue.status).to.be.eql(expectedValue.status);
        });
        afterEach( ()=> {
            sandbox.restore();
        });
        
    });

    describe('Create New Post', () =>{
        reqBody = {title: 'title', body: 'body'};
        author_name = 'author_name', author_email ='a_email';
        beforeEach( ()=> {
            sandbox.restore();
        });
        it('should return status 200 for successfull database operation', async ()=>{
            //TODO: stub Post constructor
            post = {title: 'title', body: 'body', save: ()=>{ }};
            sandbox.stub(Post.prototype,'save')
            .callsFake();

            expectedValue = {data: 'Post Created', status: 201}; 
            
            returnedValue = await postService.createNewPost(reqBody, author_name, author_email);
            expect(returnedValue).to.be.eql(expectedValue);
        });

        it('should return 500 for server error', async ()=>{
            //TODO: stub Post constructor
            err = {message: 'server failed'};
            sandbox.stub(Post.prototype,'save')
            .throws(err);
            expectedValue = {data: err.message, status: 500};
            returnedValue = await postService.createNewPost(reqBody, author_name, author_email);
            expect(returnedValue.status).to.be.eql(expectedValue.status);
        });

        afterEach( ()=> {
            sandbox.restore();
        });
        
    });

    describe('Update Post by id', () =>{
        post = {title: 'old title', body:'new body', author: 'author'};
        id='post id';
        beforeEach( ()=> {
            sandbox.restore();
        });
        it('should return status 200 for successfull database operation', async ()=>{
            sandbox.stub(Post, 'findByIdAndUpdate')
            .returns(post);

            expectedValue = {data: 'Post Updated', status: 201}; 
            
            returnedValue = await postService.updatePostById(id,post);
            expect(returnedValue).to.be.eql(expectedValue);
        });

        it('should return 500 for server error', async ()=>{
            err = {message: 'server failed'};
            sandbox.stub(Post, 'findByIdAndUpdate')
            .throws(err);
            expectedValue = {data: err.message, status: 500};
            returnedValue = await postService.updatePostById(id,post);
            expect(returnedValue.status).to.be.eql(expectedValue.status);
        });

        afterEach( ()=> {
            sandbox.restore();
        });
        
    });

    describe('delete Post', () =>{
        id='post id';
        beforeEach( ()=> {
            sandbox.restore();
        });
        it('should return status 200 for successfull database operation', async ()=>{
            sandbox.stub(Post, 'findByIdAndDelete')
            .returns(id);

            expectedValue = {data: 'Post Deleted', status: 200}; 
            
            returnedValue = await postService.deletePostById(id);
            expect(returnedValue).to.be.eql(expectedValue);
        });

        it('should return 500 for server error', async ()=>{
            err = {message: 'server failed'};
            sandbox.stub(Post, 'findByIdAndDelete')
            .throws(err);
            expectedValue = {data: err.message, status: 500};
            returnedValue = await postService.deletePostById(id);
            expect(returnedValue.status).to.be.eql(expectedValue.status);
        });

        afterEach( ()=> {
            sandbox.restore();
        });
        
        
    });

});