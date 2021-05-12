const express = require('express');
const bcryptjs = require("bcryptjs");
let request = require('supertest');
const jwt = require('jsonwebtoken');
// const chai = require('chai');
// const expect = chai.expect;

const {db_connection} = require('../../connections/db.connection');
const {server_connection} = require('../../connections/server.connection');
const User = require('../../models/user.model');
const Post = require('../../models/post.model');
let app = require('../../app');

const dotenv = require('dotenv');
const mongoose  = require('mongoose');
const { expect } = require('chai');
dotenv.config();

describe('Post Related Routes',()=>{
    let validToken, loginUser, anotherUser, server, db, post1, post2, posts, url, othersToken,deletedToken, tempPost;
    before(async()=>{
        const PORT = process.env.PORT|3000;
        // setTimeout(async()=>{
        //     db = await db_connection(process.env.TEST_DB_CONNECTION);
        //     console.log('faltu');
        // }, 20000);
        
        db = await db_connection(process.env.TEST_DB_CONNECTION);
        server = await server_connection(app, PORT);
        url = '/posts/';

        const hashedpassword = await bcryptjs.hash('password', 10);
        loginUser   = {
            fullname: 'user name',
            email: 'user@email.com',
            password: hashedpassword
        };
        const hashedpassword2 = await bcryptjs.hash('anotherPassword', 10);
        anotherUser   = {
            fullname: 'another user name',
            email: 'another@email.com',
            password: hashedpassword2
        };
        // await setTimeout(async()=>{
        //     await User(loginUser).save();
        // }, 3000);
        await User(loginUser).save();

        // await setTimeout(async()=>{
        //     await User(anotherUser).save();
        // }, 3000);
        await User(anotherUser).save();

        post1 = {title: 'title1', body: 'body1', author: 'user name', author_email: 'user@email.com'};
        post2 = {title: 'title2', body: 'body2', author: 'another user name', author_email: 'another@email.com'};
        
        // setTimeout(async()=>{
        //     post1 = await Post(post1).save();
        // }, 4000);
        post1 = await Post(post1).save();
        
        // setTimeout(async()=>{
        //     post2 = await Post(post2).save();
        // }, 5000);
        post2 = await Post(post2).save();
        posts = [post1, post2];
        
    });

    describe('Get All Posts',()=>{


        it('Should return dummy posts in json format if format is not specified',async()=>{
        
            await request(app).get(url).set('Accept','*/*')
            .expect(200)
            .expect((res)=>{
                expect(res.body.length).to.be.equal(2);
            })
            
        });

        it('Should return dummy posts in html format if user wants so',async()=>{
            let htmlPosts = '<div><div><h3>title1<br></h3><h3>body1<br></h3><h3>Author: user name<br></h3><br></div>';
                htmlPosts+= '<div><h3>title2<br></h3><h3>body2<br></h3><h3>Author: another user name<br></h3><br></div></div>';
            await request(app).get(url).set('Accept','text/html')
            .expect(200)
            .expect(htmlPosts);
        });

        it('Should return dummy posts in plain text format if user wants so',async()=>{
            let plainPosts = 'title1\nbody1\nAuthor: user name\n';
            plainPosts+= '\n';
            plainPosts  += 'title2\nbody2\nAuthor: another user name\n\n';
                
            await request(app).get(url)
            .set('Accept','text/plain')
            .expect(200)
            .expect(plainPosts);
        });

        it('Should return status code 500 if server is unavailable',async()=>{
            await mongoose.connection.close();
            await request(app).get(url)
            .set('Accept','text/plain')
            .expect(500)
            .expect('server failed');
            await db_connection(process.env.TEST_DB_CONNECTION);
        }).timeout(12000);
    });

    describe('Get Post',()=>{

        it('Should return particular post if id is valid',async()=>{
            await request(app).get(url+post1.id)
            .set('Accept','*/*')
            .expect(200)
            .expect(async(res)=>{
                expect(res.body.title).to.be.equal(post1.title);
                expect(res.body.body).to.be.equal(post1.body);
                expect(res.body.author).to.be.equal(post1.author);
                expect(res.body.author_email).to.be.equal(post1.author_email);
            });
        });

        it('Should return post in html format if user wants so',async()=>{
            let htmlPosts = '<div><div><h3>title1<br></h3><h3>body1<br></h3><h3>Author: user name<br></h3><br></div></div>';
            await request(app).get(url+post1.id)
            .set('Accept','text/html')
            .expect(200)
            .expect(htmlPosts);
        });

        it('Should return post in plain text format if user wants so',async()=>{
            let plainPosts = 'title1\nbody1\nAuthor: user name\n\n';
                
            await request(app).get(url+post1.id)
            .set('Accept','text/plain')
            .expect(200)
            .expect(plainPosts);
        });

        it('Should return status code 404 if id is invalid',async()=>{
            await request(app).get(url+'invaliId')
            .set('Accept','*/*')
            .expect(404)
            .expect('Invalid Post Id');
        });
        it('Should return status code 410 if post is not found',async()=>{
            await request(app).get(url+'609bf00dc0cbfb064c0be0db')
            .set('Accept','*/*')
            .expect(410)
            .expect('Post not Found');
        });
        it('Should return status code 500 if server is unavailable',async()=>{
            await mongoose.connection.close();
            await request(app).get(url+post1.id)
            .set('Accept','*/*')
            .expect(500)
            .expect('server failed');
            await db_connection(process.env.TEST_DB_CONNECTION);
        }).timeout(12000);
    });
    
    describe('Create Post',()=>{
        
        before(async()=>{
            validToken = jwt.sign({email: post1.author_email},process.env.jwtSecret,{expiresIn: '1d'});
            deletedToken = jwt.sign({email: 'deleted@email.coms'},process.env.jwtSecret,{expiresIn: '1d'});
        })
        it('Should return status code 201 after creating post successfully',async()=>{
            
            await request(app).post(url)
            .send({
                title: 'temp title',
                body: 'temp body'
            })
            .set('authorization','Bearer '+validToken)
            .expect(201)
            .expect('Post Created');
        });

        it('Should return status code 400 for incorrect post format',async()=>{
            
            await request(app).post(url)
            .send({
                title: 'temp title'
            })
            .set('authorization','Bearer '+validToken)
            .expect(400)
            .expect({message: "Incorrect Post Format",
                correctFormat: {
                    title: "",
                    body: ""
                }});
        });

        it('Should return status code 410 if user does not exist anymore',async()=>{
            
            await request(app).post(url)
            .send({
                title: 'temp title',
                body: 'temp body'
            })
            .set('authorization','Bearer '+deletedToken)
            .expect(410)
            .expect('User does not exist anymore. Please register.');
        });

        it('Should return status code 401 for invalid token',async()=>{
            
            await request(app).post(url)
            .send({
                title: 'temp title',
                body: 'temp body'
            })
            .set('authorization','Bearer invalid token')
            .expect(401)
            .expect('Please login and use correct token');
        });

        it('Should return status code 500 if server is unavailable',async()=>{
            await mongoose.connection.close();
            
            await request(app).post(url)
            .send({
                title: 'temp title',
                body: 'temp body'
            })
            .set('authorization','Bearer '+validToken)
            .expect(500)
            .expect('server failed');

            await db_connection(process.env.TEST_DB_CONNECTION);
        }).timeout(12000);
    });

    describe('Update Post',()=>{

        before(()=>{
            // validToken = jwt.sign({email: post1.author_email},process.env.jwtSecret,{expiresIn: '1d'});
            // deletedToken = jwt.sign({email: 'deleted@email.coms'},process.env.jwtSecret,{expiresIn: '1d'});
            othersToken = jwt.sign({email: post2.author_email},process.env.jwtSecret,{expiresIn: '1d'});
        });

        beforeEach(async ()=>{
            tempPost = {title: 'temp title', body: 'temp body', author: post1.author, author_email: post1.author_email};
            tempPost = await Post(tempPost).save();
        });

        it('Should return status code 201 after updating post successfully',async()=>{
            await request(app).put(url+tempPost.id)
            .send({
                title: 'updated temp title',
                body: 'updated temp body'
            })
            .set('Accept', '*/*')
            .set('authorization','Bearer '+validToken)
            .expect(201)
            .expect((res)=>{
                expect(res.body.message).to.be.eql('Post Updated');
                expect(res.body.post[0].title).to.be.eql('updated temp title');
                expect(res.body.post[0].body).to.be.eql('updated temp body');
            });
        });

        it('Should update post if body contains only \'title\'',async()=>{
            await request(app).put(url+tempPost.id)
            .send({
                title: 'updated temp title',
            })
            .set('Accept', '*/*')
            .set('authorization','Bearer '+validToken)
            .expect(201)
            .expect((res)=>{
                expect(res.body.message).to.be.eql('Post Updated');
                expect(res.body.post[0].title).to.be.eql('updated temp title');
                expect(res.body.post[0].body).to.be.eql('temp body');
            });
        });

        it('Should update post if body contains only \'body\'',async()=>{
            await request(app).put(url+tempPost.id)
            .send({
                body: 'updated temp body',
            })
            .set('Accept', '*/*')
            .set('authorization','Bearer '+validToken)
            .expect(201)
            .expect((res)=>{
                expect(res.body.message).to.be.eql('Post Updated');
                expect(res.body.post[0].title).to.be.eql('temp title');
                expect(res.body.post[0].body).to.be.eql('updated temp body');
            });
        });

        it('Should not update post if token is invalid',async()=>{
            
            await request(app).put(url+tempPost.id)
            .send({
                body: 'updated temp body',
            })
            .set('Accept', '*/*')
            .set('authorization','Bearer invalid token')
            .expect(401)
            .expect('Please login and use correct token');
        });

        it('Should not update post if user does not exist anymore',async()=>{
            await request(app).put(url+tempPost.id)
            .send({
                body: 'updated temp body',
            })
            .set('Accept', '*/*')
            .set('authorization','Bearer '+deletedToken)
            .expect(410)
            .expect('User does not exist anymore. Please register.');
        });

        it('Should not update post if logged in user is not valid author',async()=>{
            await request(app).put(url+tempPost.id)
            .send({
                body: 'updated temp body',
            })
            .set('Accept', '*/*')
            .set('authorization','Bearer '+othersToken)
            .expect(403)
            .expect('Access Denied!!');
        });

        it('Should return status code 404 for invalid post id',async()=>{
            await request(app).put(url+'invalidId')
            .send({
                body: 'updated temp body',
            })
            .set('Accept', '*/*')
            .set('authorization','Bearer '+othersToken)
            .expect(404)
            .expect('Invalid Post Id');
        });

        
        it('Should return status code 410 if post is not found',async()=>{
            await request(app).put(url+'609befb0c0cbfb064c0be0d9')
            .send({
                body: 'updated temp body',
            })
            .set('Accept', '*/*')
            .set('authorization','Bearer '+othersToken)
            .expect(410)
            .expect('Post not Found');
        });

        it('Should return status code 500 if server is unavailable',async()=>{
            await mongoose.connection.close();
            
            await request(app).put(url+tempPost.id)
            .set('authorization','Bearer '+validToken)
            .expect(500)
            .expect('server failed');
            await db_connection(process.env.TEST_DB_CONNECTION);
        }).timeout(15000);

        afterEach(async()=>{
            await Post.deleteMany({title: tempPost.title});
        });
    });

    describe('Delete Post',()=>{

        beforeEach(async ()=>{
            tempPost = {title: 'temp title', body: 'temp body', author: post1.author, author_email: post1.author_email};
            tempPost = await Post(tempPost).save();
        });

        it('Should return status code 200 after deletion',async()=>{
            await request(app).delete(url+tempPost.id)
            .set('authorization','Bearer '+validToken)
            .expect(200)
            .expect('Post Deleted');
        });
        
        it('Should not delete post if token is invalid',async()=>{
            
            await request(app).delete(url+tempPost.id)
            .set('authorization','Bearer invalid token')
            .expect(401)
            .expect('Please login and use correct token');
        });

        it('Should not delete post if user does not exist anymore',async()=>{
            await request(app).delete(url+tempPost.id)
            .set('authorization','Bearer '+deletedToken)
            .expect(410)
            .expect('User does not exist anymore. Please register.');
        });

        it('Should not delete post if logged in user is not valid author',async()=>{
            await request(app).delete(url+tempPost.id)
            .set('authorization','Bearer '+othersToken)
            .expect(403)
            .expect('Access Denied!!');
        });

        it('Should return status code 404 for invalid post id',async()=>{
            await request(app).delete(url+'invalidId')
            .set('authorization','Bearer '+othersToken)
            .expect(404)
            .expect('Invalid Post Id');
        });

        
        it('Should return status code 410 if post is not found',async()=>{
            await request(app).delete(url+'609befb0c0cbfb064c0be0d9')
            .set('authorization','Bearer '+othersToken)
            .expect(410)
            .expect('Post not Found');
        });

        it('Should return status code 500 if server is unavailable',async()=>{
            await mongoose.connection.close();
            
            await request(app).delete(url+tempPost.id)
            .set('authorization','Bearer '+validToken)
            .expect(500)
            .expect('server failed');

            await db_connection(process.env.TEST_DB_CONNECTION);
        }).timeout(12000);

        afterEach(async()=>{
            await Post.deleteMany({title: tempPost.title});
        });
    });

    after(async()=>{
        await User.deleteMany({});
        await Post.deleteMany({});
      
        await mongoose.connection.close();
        await server.close();
    })
});