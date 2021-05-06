const chai = require('chai');
const sinon = require('sinon');
const should = require('should');
const jwt = require('jsonwebtoken');
const userService = require("../../../services/user.service");

const queryUserHelper = require('../../../helpers/query.user.helper');

const sandbox = sinon.createSandbox();
const expect = chai.expect;


describe('Query user helper Unit Tests: ',() =>{
    describe('Token Validation', () =>{
        let expectedValue, returnedValue, user, userInfo;
        beforeEach(()=> {
            sandbox.restore();
        });
        
        it('should allow valid user token',async()=>{
            userInfo = {
                email: 'abc@gmail.com',
            };
            user= {
                fullname: 'Abc Def',
                email: 'abc@gmail.com',
                password: 'password'
            };
            
            sandbox.stub(jwt, 'verify')
            .returns(userInfo);
            
            sandbox.stub(userService, 'getUserByEmail')
            .returns({data: user, status: 200});
            expectedValue = user;
            
            returnedValue =  await queryUserHelper.tokenValidation("valid token");
            expect(returnedValue).to.be.equal(expectedValue);
        });

        it('should not allow deleted user\'s jwt token',async ()=>{
            userInfo = {email: 'asma@cefalo.com'};
            sandbox.stub(jwt, 'verify')
            .returns(userInfo);
            sandbox.stub(userService, 'getUserByEmail')
            .returns({data: null, status: 200});
            
            expectedValue  = null;
            returnedValue = await queryUserHelper.tokenValidation("deleted user token");
            expect(returnedValue).to.be.equal(expectedValue);
        });
        
        it('should not allow blank token', async ()=>{
            
            sandbox.stub(jwt, 'verify')
            .throws("err");     

            expectedValue = 'not verified token';
            returnedValue =  await queryUserHelper.tokenValidation("");
            expect(returnedValue).to.be.equal(expectedValue);
            sandbox.mock(userService).expects("getUserByEmail").exactly(0);
        });     

        afterEach( ()=>{
            sandbox.restore();
        });
        
    });
    describe('Is Logged In', () =>{
        //TODO: stubbing substring method

        let req, res, next;
        beforeEach( ()=> {
            sandbox.restore();
            next = sandbox.spy()
        });

        it('should return 401 for blank or invalid authorization header', async()=>{
            req = {
                header: (headerName)=> { return '';}
            }
            res = {
                status: sandbox.spy(),
                send: sandbox.spy()
            };
            sandbox.stub(queryUserHelper, 'tokenValidation')
            .returns('not verified token');
            let returnedValue = await queryUserHelper.tokenValidation("");
        
            returnedValue = await queryUserHelper.isLoggedIn(req,res,next);

            res.status.calledWith(401).should.equal(true, `Status ${res.status.args[0][0]}`);
            res.send.calledWith('Please login and use correct token').should.equal(true);
        });

        it('should return 410 for deleted user', async()=>{
            req = {
                header: (headerName)=> { return 'old header value';}
            };
            res = {
                status: sandbox.spy(),
                send: sandbox.spy()
            };
            sandbox.stub(queryUserHelper,'tokenValidation').returns(null);
            await queryUserHelper.isLoggedIn(req,res,next);
            res.status.calledWith(410).should.equal(true, `Status ${res.status.args[0][0]}`);
            res.send.calledWith('User does not exist anymore. Please register.').should.equal(true, `${res.send.args[0][0].message}`);
        });

        it('should call next for valid user', async()=>{
            req = {
                header: (headerName)=> { return 'valid header value';}
            };
            res = {
                status: sandbox.spy(),
                send: sandbox.spy()
            };
            let user= {
                fullname: 'Abc Def',
                email: 'abc@gmail.com',
                password: 'password'
            };
            sandbox.stub(queryUserHelper,'tokenValidation').returns(user);
            await queryUserHelper.isLoggedIn(req,res,next);
            next.calledWith(user).should.equal(true);
        });

        it('should return status 500 if server does not work', async()=>{
            req = {
                header: (headerName)=> { return 'valid header value';}
            };
            res = {
                status: sandbox.spy(),
                send: sandbox.spy()
            };
            
            sandbox.stub(queryUserHelper,'tokenValidation').returns('server failed');
            await queryUserHelper.isLoggedIn(req,res,next);
            next.notCalled.should.equal(true);
            res.status.calledWith(500).should.equal(true, `Status ${res.status.args[0][0]}`);
            res.send.calledWith('Server is not responding. Please try again later')
            .should.equal(true, `${res.send.args[0][0].message}`);
        });

        it('should return status 400 for catch block', async()=>{
            req = {
                header: (headerName)=> { return 'valid header value';}
            };
            res = {
                status: sandbox.spy(),
                send: sandbox.spy()
            };
            
            sandbox.stub(queryUserHelper,'tokenValidation').throws({message: 'error'});
            await queryUserHelper.isLoggedIn(req,res,next);
            res.status.calledWith(400).should.equal(true, `Status ${res.status.args[0][0]}`);
            res.send.calledWith('error').should.equal(true, `${res.send.args[0][0]}`);
            next.notCalled.should.equal(true);
        });

        afterEach( ()=> {
            sandbox.restore();
            next = sandbox.spy()
        });
    });

    describe('Is Valid Login Format', () =>{
        // TODO: stubbing Object key length

        let req, res, next, responseMessage;
        beforeEach( ()=> {
            sandbox.restore();
            next = sandbox.spy()
        });

        it('should return 400 if email missing',async()=>{
            req = {
                body: {
                    password: 'password'
                }
            };
            res = {
                status: sandbox.spy(),
                send: sandbox.spy()
            };
            responseMessage = {message: "Incorrect login format",
                correctFormat: {
                email: "",
                password: ""
                }
            };
            
            await queryUserHelper.isValidLoginFormat(req,res,next);
            next.notCalled.should.equal(true);
            res.status.calledWith(400).should.equal(true, `Status ${res.status.args[0][0]}`);
            res.send.calledWith(responseMessage).should.equal(true, `${res.send.args[0][0].message}`);

        });

        it('should return 400 if password missing',async()=>{
            req = {
                body: {
                    email: 'email'
                }
            };
            res = {
                status: sandbox.spy(),
                send: sandbox.spy()
            };
            responseMessage = {message: "Incorrect login format",
                correctFormat: {
                email: "",
                password: ""
                }
            };
            
            await queryUserHelper.isValidLoginFormat(req,res,next);
            next.notCalled.should.equal(true);
            res.status.calledWith(400).should.equal(true, `Status ${res.status.args[0][0]}`);
            res.send.calledWith(responseMessage).should.equal(true, `${res.send.args[0][0].message}`);

        });

        it('should return 400 for extra information',async()=>{
            req = {
                body: {
                    email: 'email',
                    password: 'password',
                    fullname: 'name'
                }
            };
            res = {
                status: sandbox.spy(),
                send: sandbox.spy()
            };
            responseMessage = {message: "Incorrect login format",
                correctFormat: {
                email: "",
                password: ""
                }
            };
            
            await queryUserHelper.isValidLoginFormat(req,res,next);
            next.notCalled.should.equal(true);
            res.status.calledWith(400).should.equal(true, `Status ${res.status.args[0][0]}`);
            res.send.calledWith(responseMessage).should.equal(true, `${res.send.args[0][0].message}`);

        });

        it('should call next for correct format',async()=>{
            req = {
                body: {
                    email: 'email',
                    password: 'password'
                }
            };
            res = {
                status: sandbox.spy(),
                send: sandbox.spy()
            };
            
            await queryUserHelper.isValidLoginFormat(req,res,next);
            next.calledOnceWith().should.equal(true);
            

        });

        it('should return error for catch block',async()=>{
            req = {
                body: undefined
            };
            res = {
                status: sandbox.spy(),
                send: sandbox.spy()
            };
            responseMessage = 'Cannot read property \'email\' of undefined';
            await queryUserHelper.isValidLoginFormat(req,res,next);
            next.notCalled.should.equal(true);
            res.status.calledWith(400).should.equal(true, `Status: ${res.status.args[0][0]}`);
            res.send.calledWith(responseMessage).should.equal(true, `Message: ${res.send.args[0][0]}`);

        });
        afterEach( ()=> {
            sandbox.restore();
            next = sandbox.spy()
        });
    });

    describe('Is Valid Registration Format', () =>{
        let req, res, next;
        beforeEach( ()=> {
            sandbox.restore();
            next = sandbox.spy()
        });

        it('should return 400 if any information is missing',async()=>{
            req = {
                body: {
                    fullname: 'name',
                    password: 'password'
                }
            };
            res = {
                status: sandbox.spy(),
                send: sandbox.spy()
            };
            responseMessage = {message: "Incorrect register format",
                               correctFormat: {
                                    fullname: "",
                                    email: "",
                                    password: ""
            }};
            await queryUserHelper.isValidRegistrationFormat(req,res,next);
            next.notCalled.should.equal(true);
            res.status.calledWith(400).should.equal(true, `Status: ${res.status.args[0][0]}`);
            res.send.calledWith(responseMessage).should.equal(true, `Message: ${res.send.args[0][0]}`);

        });

        it('should call next for correct format',async()=>{
            req = {
                body: {
                    fullname: 'name',
                    email: 'email',
                    password: 'password'
                }
            };
            res = {
                status: sandbox.spy(),
                send: sandbox.spy()
            };
            await queryUserHelper.isValidRegistrationFormat(req,res,next);
            next.calledOnceWith().should.equal(true);

        });

        it('should return error for catch block',async()=>{
            req = {
                body: undefined
            };
            res = {
                status: sandbox.spy(),
                send: sandbox.spy()
            };
            responseMessage = 'Cannot read property \'email\' of undefined';
            await queryUserHelper.isValidRegistrationFormat(req,res,next);
            next.notCalled.should.equal(true);
            res.status.calledWith(400).should.equal(true, `Status: ${res.status.args[0][0]}`);
            res.send.calledWith(responseMessage).should.equal(true, `Message:S ${res.send.args[0][0]}`);

        });

        afterEach( ()=> {
            sandbox.restore();
            next = sandbox.spy()
        });
    });

});