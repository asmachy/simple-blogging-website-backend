const chai = require('chai');
const sinon = require('sinon');
const should = require('should');
const jwt = require('jsonwebtoken');
const userService = require("../../../services/user.service");

const queryUserHelper = require('../../../helpers/query.user.helper');

const sandbox = sinon.createSandbox();
const expect = chai.expect;


describe('Query user helper Unit Tests: ',() =>{
    describe('token validation', () =>{
        let expectedValue, stub, returnedValue, user, userInfo;
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
            
            stub = sandbox.stub(userService, 'getUserByEmail');
            stub.returns(Promise.resolve(user));
            expectedValue = user;
            
            returnedValue =  await queryUserHelper.tokenValidation("valid token");

            expect(returnedValue).to.be.equal(expectedValue);
        });

        it('should not allow deleted user\'s jwt token',async ()=>{
            userInfo = {email: 'asma@cefalo.com'};
            sandbox.stub(jwt, 'verify')
            .returns(userInfo);
            stub = sandbox.stub(userService, 'getUserByEmail');
            stub.returns(Promise.resolve(null));
            
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
    describe('is logged in', () =>{
        //TODO: stubbing substring method

        let req, res, stub, next = sandbox.spy();
        beforeEach( ()=> {
            sandbox.restore();
        });

        it('should return 401 for blank or invalid authorization header', async()=>{
            req = {
                header: (headerName)=> { return '';}
            }
            res = {
                status: sandbox.spy(),
                send: sandbox.spy()
            };
            stub = sandbox.stub(queryUserHelper, 'tokenValidation');
            stub.returns(Promise.resolve('not verified token'));
            let returnedValue = await queryUserHelper.tokenValidation("");
            console.log(returnedValue);

            returnedValue = await queryUserHelper.isLoggedIn(req,res,next);
            console.log(res);
            res.status.calledWith(401).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
            res.send.calledWith({message:'Please login and use correct token'}).should.equal(true);
        });

        it('should return 410 for deleted user', async()=>{
            req = {
                header: (headerName)=> { return 'old header value';}
            };
            res = {
                status: sandbox.spy(),
                send: sandbox.spy()
            };
            sandbox.stub(queryUserHelper,'tokenValidation').returns(Promise.resolve(null));
            await queryUserHelper.isLoggedIn(req,res,next);
            res.status.calledWith(410).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
            res.send.calledWith({message: 'User does not exist anymore. Please register.'}).should.equal(true, `${res.send.args[0][0].message}`);
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
            sandbox.stub(queryUserHelper,'tokenValidation').returns(Promise.resolve(user));
            await queryUserHelper.isLoggedIn(req,res,next);
            next.calledWith(user).should.equal(true);
        });

        afterEach( ()=> {
            sandbox.restore();
        });
    });

    describe('is valid login format', () =>{
        // TODO: stubbing Object key length

        let req, res, stub, next = sandbox.spy(), responseMessage;
        beforeEach( ()=> {
            sandbox.restore();
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
            res.status.calledWith(400).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
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
            res.status.calledWith(400).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
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
            res.status.calledWith(400).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
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
            // next.calledWith().should.equal(true);
            next.calledOnce.should.equal(true);
            

        });
        
        afterEach( ()=> {
            sandbox.restore();
        });
    });

    describe('is valid registration format', () =>{
        let req, res, stub, next = sandbox.spy();
        beforeEach( ()=> {
            sandbox.restore();
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
            res.status.calledWith(400).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
            res.send.calledWith(responseMessage).should.equal(true, `${res.send.args[0][0].message}`);

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
            next.calledWith().should.equal(true);

        });

        afterEach( ()=> {
            sandbox.restore();
        });
    });

});