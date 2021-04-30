const chai = require('chai');
const sinon = require('sinon');
const should = require('should');
const mongoose = require('mongoose');

const postService = require("../../../services/post.service");
const queryPostHelper = require('../../../helpers/query.post.helper');
const { stub } = require('sinon');

const sandbox = sinon.createSandbox();
const expect = chai.expect;

describe('Query post helper Unit Tests: ',() =>{
    describe('is valid author: ',() =>{
        let req, res, responseMessage, next = sandbox.spy(), stub, author,post;
        beforeEach( ()=>{
            sandbox.restore();
        });
        it('should return 410 for deleted post',async()=>{
            req={ params: { id: 'deleted post id' } };
            res = { status: sandbox.spy(), send: sandbox.spy() };
            stub = sandbox.stub(postService, 'getPostById');
            stub.returns(Promise.resolve(null));
            await queryPostHelper.isValidAuthor(author,req,res,next);
            responseMessage = {message:'Post not Found'};
            res.status.calledWith(410).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
            res.send.calledWith(responseMessage).should.equal(true);
        });

        it('should return 403 status if user is not author', async()=>{
            req= { params: { id: 'id of other\'s post' } };
            res = { status: sandbox.spy(), send: sandbox.spy() };
            author = {email: 'isNotRealAuthor@email.com'};
            post = {author_email: 'realAuthor@email.com'};
            responseMessage = {message: "Access Denied!!"};
            stub = sandbox.stub(postService, 'getPostById');
            stub.returns(post);
            await queryPostHelper.isValidAuthor(author,req,res,next);
            res.status.calledWith(403).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
            res.send.calledWith(responseMessage).should.equal(true);

        });

        it('should return call next if user is author', async()=>{
            req= { params: { id: 'id of own post' } };
            author = {email: 'realAuthor@email.com'};
            post = {author_email: 'realAuthor@email.com'};
            stub = sandbox.stub(postService, 'getPostById');
            stub.returns(post);
            await queryPostHelper.isValidAuthor(author,req,res,next);
            next.calledOnceWith(post).should.equal(true);
        });

        afterEach( ()=>{
            sandbox.restore();
        });
    
    });

    describe('is valid post id: ',()=>{
        let req, res, next = sandbox.spy(),stub,responseMessage;
        beforeEach( ()=>{
            sandbox.restore();
        });
        
        it('should return 404 for invalid post id',async()=>{
            req= { params:  {id: 'invalid post id' } };
            
            res = {status: sandbox.spy(), send: sandbox.spy()}
            stub = sandbox.stub(mongoose.Types.ObjectId, 'isValid');
            stub.returns(false);
            responseMessage = {message: "Invalid Post Id"};
            await queryPostHelper.isValidPostId(req,res,next);
            res.status.calledWith(404).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
            res.send.calledWith(responseMessage).should.equal(true);
        });

        it('should call next for valid post id',async()=>{
            req= { params: { id: 'valid post id' } };
            stub = sandbox.stub(mongoose.Types.ObjectId, 'isValid');
            stub.returns(true);
            await queryPostHelper.isValidPostId(req,res,next);
            next.calledOnce.should.equal(true);
        });
        
        afterEach( ()=>{
            sandbox.restore();
        });
    });
    describe('is valid NEW POST  FORMAT: ',() =>{
        let req, res, next = sandbox.spy(), responseMessage;
        beforeEach( ()=>{
            sandbox.restore();
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
            res.status.calledWith(400).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
            res.send.calledWith(responseMessage).should.equal(true);


        });
        
        it('should call next once if post format is correct', async()=>{
            req= {
                body:{
                    title: 'title', body: 'body'
                }
            };
            await queryPostHelper.isValidNewPostFormat(req,res,next);
            next.calledOnce.should.equal(true);
        });

        afterEach( ()=>{
            sandbox.restore();
        });
    });
    
});