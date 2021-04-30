const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const should = require('should');
const jwt = require('jsonwebtoken');
const sandbox = sinon.createSandbox();

const controllerHelper = require('../../../helpers/controller.helper');
const postService = require("../../../services/post.service");
const { json } = require('body-parser');

describe('controller helper unit test',()=>{
    describe('update post content',()=>{
        let reqBody, post, returnedValue, expectedValue;
        it('should update only body if req contain only body',async()=>{
            reqBody = { body:'new body'};
            post = {
                title:'old title', 
                body:'old body'
            };
            expectedValue = {
                title:'old title', 
                body:'new body'
            };
            returnedValue = await controllerHelper.updatePostContent(reqBody,post);
            expect(returnedValue).to.be.eql(expectedValue);
        });

        it('should update only title if req contain only body',async()=>{
            reqBody = {
                title:'new title'
            };
            post = {
                title:'old title', 
                body:'old body'
            };
            expectedValue = {
                title:'new title', 
                body:'old body'
            };
            returnedValue = await controllerHelper.updatePostContent(reqBody,post);
            expect(returnedValue).to.be.eql(expectedValue);
        });

        it('should update both if req contains both',async()=>{
            reqBody = {
                title:'new title',
                body:'new body'
            };
            post = {
                title:'old title', 
                body:'old body'
            };
            expectedValue = {
                title:'new title', 
                body:'new body'
            };
            returnedValue = await controllerHelper.updatePostContent(reqBody,post);
            expect(returnedValue).to.be.eql(expectedValue);
        });
        afterEach( ()=> {
            sandbox.restore();
        });
    });

    describe('convert properties',()=>{
        let post= {title:'title',body:'body',author:'author'}, seperation, seperationEnd, newLine, expectedValue, returnedValue;
        it('should return properties correctly in case of html format',async()=>{
            seperation = '<h3>', seperationEnd = '</h3>', newLine = '<br>';
            expectedValue = '<h3>title<br></h3><h3>body<br></h3><h3>Author: author<br></h3>';
            returnedValue = await controllerHelper.convertProperties(post,seperation,seperationEnd,newLine);
            expect(returnedValue).to.be.eql(expectedValue);
        });

        it('should return properties correctly in case of text format',async()=>{
            seperation = '', seperationEnd = '', newLine = '\n';
            expectedValue = 'title\nbody\nAuthor: author\n';
            returnedValue = await controllerHelper.convertProperties(post,seperation,seperationEnd,newLine);
            expect(returnedValue).to.be.eql(expectedValue);
        });
        afterEach( ()=> {
            sandbox.restore();
        });

    });

    describe('generate html body',()=>{
        let post= {title:'title',body:'body',author:'author'};
        let expectedValue, returnedValue,stub;
        it('should return single post correctly',async()=>{
            stub = sandbox.stub(controllerHelper,'convertProperties');
            let stubReturn = '<h3>title<br></h3><h3>body<br></h3><h3>Author: author<br></h3>';
            stub.returns(Promise.resolve(stubReturn));
            expectedValue = '<div><div>'+stubReturn+'<br></div></div>';
            returnedValue = await controllerHelper.generateHtmlBody([post]);
            expect(returnedValue).to.be.eql(expectedValue);
        });

        it('should return multiple posts correctly',async()=>{
            let post2= {title:'title2',body:'body2',author:'author2'};
            stub = sandbox.stub(controllerHelper,'convertProperties');
            let stubReturn1 = '<h3>title<br></h3><h3>body<br></h3><h3>Author: author<br></h3>';
            let stubReturn2 = '<h3>title2<br></h3><h3>body2<br></h3><h3>Author: author2<br></h3>';
            stub.onCall(0).returns(stubReturn1)
            .onCall(1).returns(stubReturn2);
            
            expectedValue = '<div><div>'+stubReturn1+'<br></div><div>'+stubReturn2+'<br></div></div>';
            returnedValue = await controllerHelper.generateHtmlBody([post,post2]);
            expect(returnedValue).to.be.eql(expectedValue);
        });
        afterEach( ()=> {
            sandbox.restore();
        });

    });

    describe('generate plain text body',()=>{
        let post= {title:'title',body:'body',author:'author'};
        let expectedValue, returnedValue,stub;
        it('should return single post correctly',async()=>{
            stub = sandbox.stub(controllerHelper,'convertProperties');
            let stubReturn = 'title\nbody\nAuthor: author\n';
            stub.returns(Promise.resolve(stubReturn));
            expectedValue = stubReturn+'\n';
            returnedValue = await controllerHelper.generatePlainTextBody([post]);
            expect(returnedValue).to.be.eql(expectedValue);
        });

        it('should return multiple posts correctly',async()=>{
            let post2= {title:'title2',body:'body2',author:'author2'};
            stub = sandbox.stub(controllerHelper,'convertProperties');
            let stubReturn1 = 'title\nbody\nAuthor: author\n';
            let stubReturn2 = 'title2\nbody2\nAuthor: author2\n';
            stub.onCall(0).returns(stubReturn1)
            .onCall(1).returns(stubReturn2);
            expectedValue = stubReturn1+'\n'+stubReturn2+'\n';
            returnedValue = await controllerHelper.generatePlainTextBody([post,post2]);
            expect(returnedValue).to.be.eql(expectedValue);
        });
        afterEach( ()=> {
            sandbox.restore();
        });

    });
    describe('Convert Posts To Desired Type', ()=>{
        let content_type, dataArray = { body: 'jsonbody'}, returnedValue, expectedValue, stub;
        let htmlBody = '<div>html body<div>', textBody = 'text body\n', jsonBody = { body: 'jsonbody'};
        it('should return html format if content type is html',async()=>{
            content_type = 'text/html';
            expectedValue = htmlBody;
            stub= sandbox.stub(controllerHelper,'generateHtmlBody')
            stub.returns(htmlBody);
            returnedValue = await controllerHelper.convertPostsToDesiredType(content_type,dataArray);
            expect(returnedValue).to.be.eql(expectedValue);
        });
        it('should return text format if content type is html',async()=>{
            content_type = 'text/plain';
            stub = sandbox.stub(controllerHelper, 'generatePlainTextBody')
            stub.returns(textBody);
            expectedValue = textBody;
            returnedValue = await controllerHelper.convertPostsToDesiredType(content_type,dataArray);
            expect(returnedValue).to.be.eql(expectedValue);
        });
        it('should return html format if content type is html',async()=>{
            content_type = 'text/json';
            expectedValue = jsonBody;
            returnedValue = await controllerHelper.convertPostsToDesiredType(content_type,dataArray);
            expect(returnedValue).to.be.eql(expectedValue);
        });
        afterEach( ()=> {
            sandbox.restore();
        });
    })
});