const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const should = require('should');
const mongoose = require('mongoose');
const sandbox = sinon.createSandbox();

const User = require('../../../models/user.model');
const userService = require('../../../services/user.service');
const bcryptjs = require("bcryptjs");

describe('User Service Unit Tests: ',() =>{
    let reqBody, expectedValue, user, returnedValue;
    user = {fullname: 'name', email: 'email', password: 'hashed password'};
    describe('Create New User', () =>{
        reqBody = {fullname: 'name', email: 'email', password: 'password'};
        beforeEach( ()=> {
            sandbox.restore();
        });
        it('should return status 200 for successfull database operation', async ()=>{
            //TODO: stub User constructor
            
            sandbox.stub(bcryptjs, 'hash').returns('hashed password');
            sandbox.stub(User.prototype,'save')
            .returns(user);

            expectedValue = {data: 'Registration Successfull', status: 201}; 
            
            returnedValue = await userService.createNewUser(reqBody);
            expect(returnedValue).to.be.eql(expectedValue);
        });

        it('should return 500 for server error', async ()=>{
            //TODO: stub User constructor
            err = {message: 'server failed'};
            sandbox.stub(bcryptjs, 'hash')
            .throws(err);
            expectedValue = {data: err.message, status: 500};
            returnedValue = await userService.createNewUser(reqBody);
            expect(returnedValue.status).to.be.eql(expectedValue.status);
        });

        afterEach( ()=> {
            sandbox.restore();
        });
        
    });

    describe('Get ALL User', () =>{
        let users = [user, {fullname: 'user2', email: 'user2mail', password:'user2pass'}];
        beforeEach( ()=> {
            sandbox.restore();
        });
        it('should return status 200 for successfull database operation', async ()=>{
            expectedValue = {data: users, status: 200}; 
            sandbox.stub(User, 'find')
            .returns(users);
            returnedValue = await userService.getAllUser();
            expect(returnedValue).to.be.eql(expectedValue);
        });

        it('should return 500 for server error', async ()=>{
            err = {message: 'server failed'};
            sandbox.stub(User, 'find')
            .throws(err);
            expectedValue = {data: err.message, status: 500};
            returnedValue = await userService.getAllUser();
            expect(returnedValue.status).to.be.eql(expectedValue.status);
        });

        afterEach( ()=> {
            sandbox.restore();
        });
            
    });

    describe('Get User By Email', () =>{
        let email = 'email';
        beforeEach( ()=> {
            sandbox.restore();
        });
        it('should return status 200 for successful server operation', async ()=>{
            sandbox.stub(User, 'findOne')
            .returns(user);
            expectedValue = {data: user, status: 200};
            returnedValue=await userService.getUserByEmail();
            expect(returnedValue).to.be.eql(expectedValue);
        });
        it('should return 500 for server error', async ()=>{
            err = {message: 'server failed'};
            sandbox.stub(User, 'findOne')
            .throws(err);
            expectedValue = {data: err.message, status: 500};
            returnedValue=await userService.getUserByEmail();
            expect(returnedValue.status).to.be.eql(expectedValue.status);
        });
        afterEach( ()=> {
            sandbox.restore();
        });
        
    });


});