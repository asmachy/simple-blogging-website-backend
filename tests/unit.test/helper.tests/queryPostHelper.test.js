const chai = require('chai');
const sinon = require('sinon');
const should = require('should');
const mongoose = require('mongoose');

const postService = require("../../../services/post.service");
const queryPostHelper = require('../../../helpers/query.post.helper');
// const { stub } = require('sinon');

const sandbox = sinon.createSandbox();
const expect = chai.expect;

describe('Query post helper Unit Tests: ',() =>{
    describe('is valid author: ',() =>{
        let req, res, responseMessage, next, author,post;
        beforeEach( ()=>{
            sandbox.restore();
            next = sandbox.spy()
        });
        it('should return 410 for deleted post',async()=>{
            req={ params: { id: 'deleted post id' } };
            res = { status: sandbox.spy(), send: sandbox.spy() };
            sandbox.stub(postService, 'getPostById')
            .returns({data: null, status:200});
            await queryPostHelper.isValidAuthor(author,req,res,next);
            responseMessage = 'Post not Found';
            res.status.calledWith(410).should.equal(true, `Status ${res.status.args[0][0]}`);
            res.send.calledWith(responseMessage).should.equal(true);
            next.notCalled.should.equal(true);
        });

        it('should return 403 status if user is not author', async()=>{
            req= { params: { id: 'id of other\'s post' } };
            res = { status: sandbox.spy(), send: sandbox.spy() };
            author = {email: 'isNotRealAuthor@email.com'};
            post = {author_email: 'realAuthor@email.com'};
            responseMessage = 'Access Denied!!';
            sandbox.stub(postService, 'getPostById')
            .returns({data: post, status:200});
            await queryPostHelper.isValidAuthor(author,req,res,next);
            res.status.calledWith(403).should.equal(true, `Status ${res.status.args[0][0]}`);
            res.send.calledWith(responseMessage).should.equal(true);
            next.notCalled.should.equal(true);
        });

        it('should return call next if user is author', async()=>{
            req= { params: { id: 'id of own post' } };
            author = {email: 'realAuthor@email.com'};
            post = {author_email: 'realAuthor@email.com'};
            sandbox.stub(postService, 'getPostById')
            .returns({data: post, status: 200});
            await queryPostHelper.isValidAuthor(author,req,res,next);
            next.calledOnceWith(post).should.equal(true);
        });
        it('should return status 500 if server is not responding', async()=>{
            req= { params: { id: 'id of own post' } };
            author = {email: 'realAuthor@email.com'};
            post = {author_email: 'realAuthor@email.com'};
            sandbox.stub(postService, 'getPostById')
            .returns({data: 'server failed', status: 500});
            await queryPostHelper.isValidAuthor(author,req,res,next);
            responseMessage= 'Server is not responding. Please try again later';
            res.status.calledWith(500).should.equal(true, `Status ${res.status.args[0][0]}`);
            res.send.calledWith(responseMessage).should.equal(true);
            next.notCalled.should.equal(true);
        });
        it('should return status 400 for catch block', async()=>{
            req= { params: { id: 'id of own post' } };
            sandbox.stub(postService, 'getPostById')
            .throws({message: 'error'});
            await queryPostHelper.isValidAuthor(author,req,res,next);
            res.status.calledWith(400).should.equal(true, `Status ${res.status.args[0][0]}`);
            res.send.calledWith('error').should.equal(true);
            next.notCalled.should.equal(true);
        });

        afterEach( ()=>{
            sandbox.restore();
            next = sandbox.spy()
        });
    
    });

    describe('Is Valid Post Id: ',()=>{
        let req, res, next,responseMessage;
        beforeEach( ()=>{
            sandbox.restore();
            next = sandbox.spy()
        });
        
        it('should return 404 for invalid post id',async()=>{
            req= { params:  {id: 'invalid post id' } };
            
            res = {status: sandbox.spy(), send: sandbox.spy()}
            sandbox.stub(mongoose.Types.ObjectId, 'isValid')
            .returns(false);
            responseMessage = 'Invalid Post Id';
            await queryPostHelper.isValidPostId(req,res,next);
            res.status.calledWith(404).should.equal(true, `Status ${res.status.args[0][0]}`);
            res.send.calledWith(responseMessage).should.equal(true, `message ${res.send.args[0][0]}`);
            next.notCalled.should.equal(true);
        });

        it('should call next for valid post id',async()=>{
            req= { params: { id: 'valid post id' } };
            sandbox.stub(mongoose.Types.ObjectId, 'isValid')
            .returns(true);
            await queryPostHelper.isValidPostId(req,res,next);
            next.calledOnceWith().should.equal(true);
        });
        it('should return status 400 for catch block', async()=>{
            req= { params: { id: 'valid post id' } };
            sandbox.stub(mongoose.Types.ObjectId, 'isValid')
            .throws({message: 'error'});
            await queryPostHelper.isValidPostId(req,res,next);
            res.status.calledWith(400).should.equal(true, `Status ${res.status.args[0][0]}`);
            res.send.calledWith('error').should.equal(true);
            next.notCalled.should.equal(true);
        });
        afterEach( ()=>{
            sandbox.restore();
            next = sandbox.spy()
        });
    });
    describe('Is Valid NEW POST  FORMAT: ',() =>{
        let req, res, next, responseMessage;
        beforeEach( ()=>{
            sandbox.restore();
            next = sandbox.spy()
        });

        it('should return 400 in case of missing info',async()=>{
            req= {
                body:{
                    body: 'body'
                }
            };
            res = {status: sandbox.spy(), send: sandbox.spy()};
            responseMessage = {message: "Incorrect Post Format",
                                correctFormat: {
                                title: "",
                                body: ""
            }};
            await queryPostHelper.isValidNewPostFormat(req,res,next);
            res.status.calledWith(400).should.equal(true, `Status ${res.status.args[0][0]}`);
            res.send.calledWith(responseMessage).should.equal(true);
            next.notCalled.should.equal(true);

        });
        
        it('should call next once if post format is correct', async()=>{
            req= {
                body:{
                    title: 'title', body: 'body'
                }
            };
            await queryPostHelper.isValidNewPostFormat(req,res,next);
            next.calledOnceWith().should.equal(true);
        });
        afterEach( ()=>{
            sandbox.restore();
            next = sandbox.spy()
        });
    });
    
});