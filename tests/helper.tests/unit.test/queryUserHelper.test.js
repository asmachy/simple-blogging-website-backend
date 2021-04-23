const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const should = require('should');
const jwt = require('jsonwebtoken');
const sandbox = sinon.createSandbox();

const queryUserHelper = require('../../../helper/query.user.helper');
const UserService = require('../../../services/user.service');
const userService = new UserService();
// const { mock } = require('sinon');

describe('Query user helper Unit Tests: ',() =>{
    describe('token validation', () =>{
        let res;

        afterEach( function(done) {
            sandbox.restore();
            done();
        });
        beforeEach( function (done) {
            
            done();
        });

        it('should not allow blank token',function (done){
            sandbox.stub(jwt, 'verify')
            .throws("err");     

            sandbox.mock(userService).expects("getUserByEmail").exactly(0);
            res = {
                status: sandbox.spy(),
                send: sandbox.spy()
            };
            queryUserHelper.tokenValidation("", res);
            res.status.calledWith(401).should.equal(true, 'Bad Status ${res.status.args[0][0]}');
            res.send.calledWith({message: "Please login and use correct token"}).should.equal(true);
            done();
        });
        it('should not allow invalid jwt token',function (done){
            sandbox.stub(jwt, 'verify')
            .returns({email: 'asma@cefalo.com'});

            sandbox.stub(userService, 'getUserByEmail')
            .returns( null);;
            res = {
                status: sandbox.spy(),
                send: sandbox.spy()
            };
            queryUserHelper.tokenValidation("invalidToken", res);
            res.status.calledWith(401).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
            res.send.calledWith({message: "Please login and use correct token"}).should.equal(true);
            done();
        });

        it('should allow valid user token',function (done){
            sandbox.stub(jwt, 'verify')
            .returns({
                email: 'abc@gmail.com',
            });
            sandbox.stub(userService, 'getUserByEmail')
            .returns({
                fullname: 'Abc Def',
                email: 'abc@gmail.com',
                password: '$2a$10$WPkBWD3lXIx6/LQon.rRhOMnUiYMAEDFs5d1CUo41pXClWeK0G7jq'
            });
            res = {
                status: sandbox.spy(),
                send: sandbox.spy()
            };   
            const user = queryUserHelper.tokenValidation("shfb",res);
            expect(user).to.have.own.property('fullname');
            expect(user).to.have.own.property('email');
            done();
        });
    });
});