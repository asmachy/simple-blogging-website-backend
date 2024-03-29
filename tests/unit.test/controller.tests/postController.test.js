const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const should = require('should');
const jwt = require('jsonwebtoken');
const sandbox = sinon.createSandbox();

const postController = require('../../../controllers/post.controller');
const postService = require('../../../services/post.service');
const controllerHelper = require('../../../helpers/controller.helper');

describe('Post Controller Unit Tests: ',() =>{
    let req, res, responseMessage, post, posts, user, returnedValue;
    describe('Get Post', () =>{
        beforeEach( ()=> {
            sandbox.restore();
        });
        it('should return status code 410 for deleted post id', async ()=>{
            req = { params: { id: "deleted post Id" } };
            res = {status : sandbox.spy(), send: sandbox.spy()};
            post = {data: null, status: 200}; 
            sandbox.stub(postService, 'getPostById')
            .returns(post);
            await postController.getPost(req,res);
            
            res.status.calledWith(410).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
            responseMessage = 'Post not Found';
            res.send.calledWith(responseMessage).should.equal(true, `${res.send.args[0][0]}`);
        });

        it('should return post for valid post id in requested format', async ()=>{
            req = { 
                    params: { id: "deleted post Id" }, 
                    header: ()=>{return 'text/json'} 
                };
            res = {status : sandbox.spy(), send: sandbox.spy()};
            post = {title: 'valid post', body: 'valid post body'};
            returnedValue = {data: post, status: 200};
            sandbox.stub(postService, 'getPostById')
            .returns(returnedValue);
            sandbox.stub(controllerHelper, 'convertPostsToDesiredType')
            .returns([post]);
            responseMessage = [post];
            await postController.getPost(req,res);
            res.status.calledWith(200).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
            res.send.calledWith(responseMessage).should.equal(true, `${res.send.args[0][0]}`);
        });

        it('should return 500 for server error', async ()=>{
            req = { 
                    params: { id: "deleted post Id" }, 
                    header: ()=>{return 'text/html'} 
                };
            res = {status : sandbox.spy(), send: sandbox.spy()};
            returnedValue = {data: 'error in server', status: 500};
            sandbox.stub(postService, 'getPostById')
            .returns(returnedValue);
            responseMessage = returnedValue;
            // stub2 = sandbox.stub(controllerHelper, 'convertPostsToDesiredType');
            // stub2.returns([post]);
            await postController.getPost(req,res);
            res.status.calledWith(responseMessage.status).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
            res.send.calledWith(responseMessage.data).should.equal(true, `${res.send.args[0][0]}`);
        });

        it('should return status code 400 for catch block', async ()=>{
            req = { 
                    params: { id: "deleted post Id" }, 
                    header: ()=>{return 'text/json'} 
                };
            res = {status : sandbox.spy(), send: sandbox.spy()};
            post = {title: 'valid post', body: 'valid post body'};
            responseMessage = {data: post, status: 200};
            sandbox.stub(postService, 'getPostById')
            .returns(responseMessage);
            sandbox.stub(controllerHelper, 'convertPostsToDesiredType')
            .throws({message: 'error'});
            responseMessage = [post];
            await postController.getPost(req,res);
            res.status.calledWith(400).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
            res.send.calledWith('error').should.equal(true, `${res.send.args[0][0]}`);
        });
        afterEach( ()=> {
            sandbox.restore();
        });
            
    });

    describe('Get Posts', () =>{
        posts = [{title: 'post1'}, {title: 'post2'}];     
        it('should return all posts in requested format', async ()=>{
            req = { 
                header: ()=>{return 'text/html'} 
            };
            res = { status : sandbox.spy(), send: sandbox.spy()};
            returnedValue = {data: posts, status: 200}
            sandbox.stub(postService, 'getAllPost')
            .returns(returnedValue);
            returnedValue = '<div><div>post1<br></div><div>post2<br></div></div>'
            sandbox.stub(controllerHelper, 'convertPostsToDesiredType')
            .returns(returnedValue);

            responseMessage = returnedValue;
            await postController.getPosts(req,res);
            res.status.calledWith(200).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
            res.send.calledWith(responseMessage).should.equal(true, `${res.send.args[0][0]}`);
        });
        it('should return 500 for server error', async ()=>{
            req = { 
                header: ()=>{return 'text/html'} 
            };
            res = { status : sandbox.spy(), send: sandbox.spy()};
            returnedValue = {data: 'error in server', status: 500}
            sandbox.stub(postService, 'getAllPost')
            .returns(returnedValue);

            responseMessage = returnedValue;
            await postController.getPosts(req,res);
            res.status.calledWith(500).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
            res.send.calledWith(responseMessage.data).should.equal(true, `${res.send.args[0][0]}`);
        });

        it('should return 400 for catch block', async ()=>{
            req = { 
                header: ()=>{return 'text/html'} 
            };
            res = { status : sandbox.spy(), send: sandbox.spy()};
            returnedValue = {data: 'ok', status: 200}
            sandbox.stub(postService, 'getAllPost')
            .returns(returnedValue);
            sandbox.stub(controllerHelper, 'convertPostsToDesiredType')
            .throws({message: 'error'});
            await postController.getPosts(req,res);
            res.status.calledWith(400).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
            res.send.calledWith('error').should.equal(true, `${res.send.args[0][0]}`);
        });

        afterEach( ()=> {
            sandbox.restore();
        });
        
    });

    describe('Create Post', () =>{
        user = {fullname: 'user', email:'user@email.com'};
        it('should return 201 after creating post successfully', async ()=>{
            req = { 
                body:{
                    title: 'create post', body: 'create post'
                }
            };
            res = { status : sandbox.spy(), send: sandbox.spy()};
            returnedValue = {data: 'Post Created', status: 201};
            sandbox.stub(postService, 'createNewPost')
            .returns(returnedValue);

            responseMessage = returnedValue;
            await postController.createPost(user,req,res);
            res.status.calledWith(responseMessage.status).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
            res.send.calledWith(responseMessage.data).should.equal(true, `${res.send.args[0][0]}`);
        });

        it('should return 500 if server sends error', async ()=>{
            req = { 
                body:{
                    title: 'create post', body: 'create post'
                }
            };
            res = { status : sandbox.spy(), send: sandbox.spy()};
            returnedValue = {data: 'Error in server', status: 500};
            sandbox.stub(postService, 'createNewPost')
            .returns(returnedValue);

            responseMessage = returnedValue;
            await postController.createPost(user,req,res);
            res.status.calledWith(responseMessage.status).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
            res.send.calledWith(responseMessage.data).should.equal(true, `${res.send.args[0][0]}`);
        });

        it('should return 400 for catch block', async ()=>{
            req = { 
                body:{
                    title: 'create post', body: 'create post'
                }
            };
            res = { status : sandbox.spy(), send: sandbox.spy()};
            sandbox.stub(postService, 'createNewPost')
            .throws({message: 'error'});

            await postController.createPost(user,req,res);
            res.status.calledWith(400).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
            res.send.calledWith('error').should.equal(true, `${res.send.args[0][0]}`);
        });

        afterEach( ()=> {
            sandbox.restore();
        });
        
    });

    describe('Update Post', () =>{
        post = {title: 'old title', body:'old body', author: 'author'};
        let msg, resBody;
        it('should return response status 201 after update post successfully', async ()=>{
            req = { 
                body: {title:'new title'},
                params: { id: 'post id'},
                header: ()=> {return 'text/plain'}
            };
            res = { status : sandbox.spy(), send: sandbox.spy()};
            returnedValue = {title: 'new title', body:'old body', author: 'author'};
            sandbox.stub(controllerHelper,'updatePostContent')
            .returns(returnedValue);
            msg = {data: 'Post updated', status: 201}
            sandbox.stub(postService, 'updatePostById')
            .returns(msg);
            resBody = 'new title\nold body\nAuthor: author\n';
            sandbox.stub(controllerHelper, 'convertPostsToDesiredType')
            .returns(resBody);

            responseMessage = {message: msg.data, post: resBody};
            await postController.updatePost(post,req,res);
            res.status.calledWith(msg.status).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
            res.send.calledWith(responseMessage).should.equal(true, `${res.send.args[0][0]}`);
        });

        it('should return 500 if server sends error', async ()=>{
            req = { 
                body: {title:'new title'},
                params: { id: 'post id'},
                header: ()=> {return 'text/plain'}
            };
            res = { status : sandbox.spy(), send: sandbox.spy()};
            returnedValue = {title: 'new title', body:'old body', author: 'author'};
            sandbox.stub(controllerHelper,'updatePostContent')
            .returns(returnedValue);
            msg = {data: 'Error in server', status: 500}
            sandbox.stub(postService, 'updatePostById')
            .returns(msg);
            resBody='';
            await postController.updatePost(user,req,res);
            res.status.calledWith(msg.status).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
            res.send.calledWith({message: msg.data, post: resBody}).should.equal(true, `${res.send.args[0][0]}`);
        });

        it('should return 400 for catch block', async ()=>{
            req = { 
                body: {title:'new title'},
                params: { id: 'post id'},
                header: ()=> {return 'text/plain'}
            };
            res = { status : sandbox.spy(), send: sandbox.spy()};
            returnedValue = {title: 'new title', body:'old body', author: 'author'};
            sandbox.stub(controllerHelper,'updatePostContent')
            .returns(returnedValue);
            msg = {data: 'Error in server', status: 500}
            sandbox.stub(postService, 'updatePostById')
            .throws({message: 'error'});

            await postController.updatePost(user,req,res);
            res.status.calledWith(400).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
            res.send.calledWith('error').should.equal(true, `${res.send.args[0][0]}`);
        });

        afterEach( ()=> {
            sandbox.restore();
        });
        
    });

    describe('delete Post', () =>{
        user = {fullname: 'user', email:'user@email.com'};
        it('should return 200 after successful delete operation', async ()=>{
            req = { 
                params: {id: 'post id'}
            };
            res = { status : sandbox.spy(), send: sandbox.spy()};
            msg = {data: 'Post deleted', status: 200};
            sandbox.stub(postService, 'deletePostById')
            .returns(msg);
            await postController.deletePost(post,req,res);
            res.status.calledWith(200).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
            res.send.calledWith(msg.data).should.equal(true, `${res.send.args[0][0]}`);
        });

        it('should return status code 500 if server sends error', async ()=>{
            req = { 
                params: {id: 'post id'}
            };
            res = { status : sandbox.spy(), send: sandbox.spy()};
            responseMessage = {data: 'Error in server', status: 500};
            sandbox.stub(postService, 'deletePostById')
            .returns(responseMessage);

            await postController.deletePost(post,req,res);
            res.status.calledWith(500).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
            res.send.calledWith(responseMessage.data).should.equal(true, `${res.send.args[0][0]}`);
        });

        it('should return status code 400 for catch block', async ()=>{
            req = { 
                params: {id: 'post id'}
            };
            res = { status : sandbox.spy(), send: sandbox.spy()};
            sandbox.stub(postService, 'deletePostById')
            .throws({message: 'error'});

            await postController.deletePost(user,req,res);
            res.status.calledWith(400).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
            res.send.calledWith('error').should.equal(true, `${res.send.args[0][0]}`);
        });

        afterEach( ()=> {
            sandbox.restore();
        });
        
    });

});