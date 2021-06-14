const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const should = require('should');
const jwt = require('jsonwebtoken');
const sandbox = sinon.createSandbox();
const bcryptjs = require("bcryptjs");

const userController = require('../../../controllers/user.controller');
const userService = require('../../../services/user.service');
const controllerHelper = require('../../../helpers/controller.helper');
// const { response } = require('express');

describe('User Controller Unit test',()=>{
    let  req, res, user, responeMessage, err;
    user = {name: 'name', email:"email", password: 'password'};
    req ={body:{email: 'email', password: 'password'}};
    describe('Create User',()=>{

        beforeEach( ()=> {
            sandbox.restore();
        });
        
        it('should return 409 status code if email already exists', async()=>{
            res = {status: sandbox.spy(), send: sandbox.spy()};            
            sandbox.stub(userService, 'getUserByEmail')
            .returns({data: user, status: 200});

            await userController.createUser(req,res);
            responeMessage = 'Email Already Exists.. Please Login.';
            res.status.calledWith(409).should.equal(true, `status returned ${res.status.args[0][0]}`);
            res.send.calledWith(responeMessage).should.equal(true, `send returned ${res.send.args[0][0]}`);
        });

        it('should return 500 status code for server error case # get user', async()=>{
            res = {status: sandbox.spy(), send: sandbox.spy()};            
            responeMessage = 'error in server';
            sandbox.stub(userService, 'getUserByEmail')
            .returns({data: responeMessage, status:500});

            await userController.createUser(req,res);
            responeMessage = 'error in server';
            res.status.calledWith(500).should.equal(true, `status returned ${res.status.args[0][0]}`);
            res.send.calledWith(responeMessage).should.equal(true, `send returned ${res.send.args[0][0]}`);
        });
        it('should return 201 status code after creating user successfully', async()=>{
            res = {status: sandbox.spy(), send: sandbox.spy()};            
            responeMessage = {data: 'Registration Successfull', status: 201};
            sandbox.stub(userService, 'getUserByEmail')
            .returns({data: null, status: 200});
            sandbox.stub(userService, 'createNewUser')
            .returns(responeMessage);

            await userController.createUser(req,res);
            res.status.calledWith(responeMessage.status).should.equal(true, `status returned ${res.status.args[0][0]}`);
            res.send.calledWith(responeMessage.data).should.equal(true, `send returned ${res.send.args[0][0]}`);
        });
        it('should return 500 status code for server error case # create new user', async()=>{
            res = {status: sandbox.spy(), send: sandbox.spy()}; 
            responeMessage = 'error in server';
            sandbox.stub(userService, 'getUserByEmail')
            .returns({data: null, status: 200});
            sandbox.stub(userService, 'createNewUser')
            .returns({data: responeMessage, status:500});

            await userController.createUser(req,res);
            responeMessage = 'error in server';
            res.status.calledWith(500).should.equal(true, `status returned ${res.status.args[0][0]}`);
            res.send.calledWith(responeMessage).should.equal(true, `send returned ${res.send.args[0][0]}`);
        });

        it('should return 400 status code for catch block', async()=>{
            err = {message: 'error'};
            res = {status: sandbox.spy(), send: sandbox.spy()}; 
            sandbox.stub(userService, 'getUserByEmail')
            .throws(err);

            await userController.createUser(req,res);
            responeMessage = err.message;
            res.status.calledWith(400).should.equal(true, `status returned ${res.status.args[0][0]}`);
            res.send.calledWith(responeMessage).should.equal(true, `send returned ${res.send.args[0][0]}`);
        });

        afterEach( ()=> {
            sandbox.restore();
        });
    });

    describe('Login',()=>{

        beforeEach( ()=> {
            sandbox.restore();
        });

        it('should return 500 status code for server error', async()=>{
            res = {status: sandbox.spy(), send: sandbox.spy()};            
            responeMessage = 'error in server';
            sandbox.stub(userService, 'getUserByEmail')
            .returns({data: responeMessage, status:500});

            await userController.login(req,res);
            responeMessage = 'error in server';
            res.status.calledWith(500).should.equal(true, `status returned ${res.status.args[0][0]}`);
            res.send.calledWith(responeMessage).should.equal(true, `send returned ${res.send.args[0][0]}`);
        });
        
        it('should return 401 if user not found', async()=>{
            res = {status: sandbox.spy(), send: sandbox.spy()};            
            sandbox.stub(userService, 'getUserByEmail')
            .returns({data: null, status: 200});

            await userController.login(req,res);
            responeMessage = 'Incorrect email or password';
            res.status.calledWith(401).should.equal(true, `status returned ${res.status.args[0][0]}`);
            res.send.calledWith(responeMessage).should.equal(true, `send returned ${res.send.args[0][0]}`);
        });

        it('should return 401 if password is incorrect', async()=>{
            req.body.password = 'incorrect password'
            res = {status: sandbox.spy(), send: sandbox.spy()};            
            sandbox.stub(userService, 'getUserByEmail')
            .returns({data: user, status: 200});
            sandbox.stub(bcryptjs, 'compare')
            .returns(false);

            await userController.login(req,res);
            responeMessage = 'Incorrect email or password';
            res.status.calledWith(401).should.equal(true, `status returned ${res.status.args[0][0]}`);
            res.send.calledWith(responeMessage).should.equal(true, `send returned ${res.send.args[0][0]}`);
        });

        it('should return 200 status code after logging in successfully', async()=>{
            req.body.password = 'password';
            let token = 'jwt token';
            res = {status: sandbox.spy(), json: sandbox.spy()};            
            responeMessage = {message: "Login Successful!",fullname: user.name, email: user.emai, token: token};
            sandbox.stub(userService, 'getUserByEmail')
            .returns({data: user, status: 200});
            sandbox.stub(bcryptjs, 'compare')
            .returns(true);
            sandbox.stub(jwt, 'sign')
            .returns(token);

            await userController.login(req,res);
            res.status.calledWith(200).should.equal(true, `status returned ${res.status.args[0][0]}`);
            res.json.calledWith(responeMessage).should.equal(true, `send returned ${res.json.args[0][0]}`);
        });

        it('should return 400 status code for catch block', async()=>{
            err = {message: 'error'};
            res = {status: sandbox.spy(), send: sandbox.spy()}; 
            sandbox.stub(userService, 'getUserByEmail')
            .returns({data: user, status: 200});
            sandbox.stub(bcryptjs, 'compare')
            .throws(err);

            await userController.login(req,res);
            responeMessage = err.message;
            res.status.calledWith(400).should.equal(true, `status returned ${res.status.args[0][0]}`);
            res.send.calledWith(responeMessage).should.equal(true, `send returned ${res.send.args[0][0]}`);
        });

        afterEach( ()=> {
            sandbox.restore();
        });
    });
});