const express = require('express');
const bcryptjs = require("bcryptjs");
let request = require('supertest');

const {db_connection} = require('../../connections/db.connection');
const {server_connection} = require('../../connections/server.connection');
const User = require('../../models/user.model');
let app = require('../../app');
// let postRoute = require('../../routes/post.route');
const dotenv = require('dotenv');
const mongoose  = require('mongoose');
dotenv.config();

describe('User Related Routes',()=>{
    let loginUser, server, db;
    before(async()=>{
        const PORT = process.env.PORT|3000;
        db = await db_connection(process.env.TEST_DB_CONNECTION);
        server = await server_connection(app, PORT);

        const hashedpassword = await bcryptjs.hash('password', 10);
        loginUser   = {
            fullname: 'user name',
            email: 'user@email.com',
            password: hashedpassword
        };
    });
    
    describe('Register',()=>{
        beforeEach(async ()=>{
            await User.deleteMany({});
            await User(loginUser).save();
        });    
        it('Should return successful message after registration',async()=>{
            
            await request(app).post('/user/register')
            .send({
                fullname: 'new user',
                email: 'newUser@email.com',
                password: 'new password'
            })
            .expect(201)
            .expect('Registration Successfull');
        });

        it('Should return \'incorrect format\' message for incorrect format of info',async()=>{
            
            await request(app).post('/user/register')
            .send({
                fullname: 'new user',
                password: 'new password'
            })
            .expect(400)
            .expect({message: "Incorrect register format",
            correctFormat: {
                fullname: "",
                email: "",
                password: ""
            }});
        });
        
        it('Should reject registration request with existed email',async()=>{
            
            await request(app).post('/user/register')
            .send({
                fullname: 'new user',
                email: 'user@email.com',
                password: 'new password'
            })
            .expect(409)
            .expect('Email Already Exists.. Please Login.');
        });

        it('Should return status code 500 for server error',async()=>{
            
            await mongoose.connection.close();
            await request(app).post('/user/register')
            .send({
                fullname: 'new user',
                email: 'user@email.com',
                password: 'new password'
            })
            .expect(500)
            .expect('server failed');
            await db_connection(process.env.TEST_DB_CONNECTION);
        }).timeout(12000);

    });

    describe('Log In',()=>{
        before(async ()=>{
            await User.deleteMany({});
            await User(loginUser).save();
            let hashedpassword2 = await bcryptjs.hash('anotherPassword', 10);
            let anotherUser = {fullname: 'another user', email: 'another@email.com', password: hashedpassword2};
            await User(anotherUser).save();
        });    
        it('Should return status code 200 and valid token after successfully loging in',async()=>{
            // token = jwt.sign({email: loginUser.email},process.env.jwtSecret,{expiresIn: '1d'});
            await request(app).post('/user/login')
            .send({
                email: 'user@email.com',
                password: 'password'
            })
            .expect(200)
            .expect((res)=>{ 
                res.body.message.should.equal("Login Successful!");
                res.body.should.have.property("token");
            });
        });

        it('Should return \'incorrect format\' message for incorrect format of login info',async()=>{
            
            await request(app).post('/user/login')
            .send({
                fullname: 'new user',
                password: 'new password'
            })
            .expect(400)
            .expect({message: "Incorrect login format",
            correctFormat: {
                email: "",
                password: ""
            }});
        });
        
        it('Should reject login request with non-existed email',async()=>{
            
            await request(app).post('/user/login')
            .send({
                email: 'invalidUser@email.com',
                password: 'password'
            })
            .expect(401)
            .expect('Incorrect email or password');
        });

        it('Should not allow login with wrong password',async()=>{
            
            await request(app).post('/user/login')
            .send({
                email: 'user@email.com',
                password: 'wrongPassword'
            })
            .expect(401)
            .expect('Incorrect email or password');
        });

        it('Should not allow login with another user\'s password',async()=>{
            
            await request(app).post('/user/login')
            .send({
                email: 'another@email.com',
                password: 'password'
            })
            .expect(401)
            .expect('Incorrect email or password');
        });

        it('Should return status code 500 for server error',async()=>{
            
            await mongoose.connection.close();
            await request(app).post('/user/login')
            .send({
                email: 'user@email.com',
                password: 'new password'
            })
            .expect(500)
            .expect('server failed');
            await db_connection(process.env.TEST_DB_CONNECTION);
        }).timeout(12000);

    });

    after(async()=>{
        await User.deleteMany({});
        await mongoose.connection.close();
        await server.close();
    });
});