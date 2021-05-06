const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const should = require('should');
const jwt = require('jsonwebtoken');
const sandbox = sinon.createSandbox();

const controllerHelper = require('../../../helpers/controller.helper');

describe('Controller Helper Unit Test',()=>{
    describe('Update Post Content',()=>{
        let reqBody, post, returnedValue, expectedValue;
        beforeEach(()=>{
            sandbox.restore();
        });
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
        it('should return error message for catch block',async()=>{
            reqBody = undefined;
            
            expectedValue = 'Cannot read property \'title\' of undefined';
            returnedValue = await controllerHelper.updatePostContent(reqBody,post);
            
            expect(returnedValue).to.be.eql(expectedValue);
        });
        afterEach( ()=> {
            sandbox.restore();
        });
    });

    describe('Convert Properties',()=>{
        let post= {title:'title',body:'body',author:'author'}, seperation, seperationEnd, newLine, expectedValue, returnedValue;
        beforeEach(()=>{
            sandbox.restore();
        });
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
        it('should return error message for catch block',async()=>{
            post = undefined;
            seperation = '', seperationEnd = '', newLine = '\n';
            
            expectedValue = 'Cannot read property \'title\' of undefined';
            returnedValue = await controllerHelper.convertProperties(post,seperation,seperationEnd,newLine);
            
            expect(returnedValue).to.be.eql(expectedValue);
        });
        afterEach( ()=> {
            sandbox.restore();
        });

    });

    describe('Generate Html Body',()=>{
        let post= {title:'title',body:'body',author:'author'},post2, stubReturn,stubReturn2;
        let expectedValue, returnedValue;
        beforeEach(()=>{
            sandbox.restore();
        });
        it('should return single post correctly',async()=>{
            stubReturn  = '<h3>title<br></h3><h3>body<br></h3><h3>Author: author<br></h3>';
            sandbox.stub(controllerHelper,'convertProperties')
            .returns(Promise.resolve(stubReturn));
            
            expectedValue = '<div><div>'+stubReturn+'<br></div></div>';
            returnedValue = await controllerHelper.generateHtmlBody([post]);
            
            expect(returnedValue).to.be.eql(expectedValue);
        });

        it('should return multiple posts correctly',async()=>{
            post2= {title:'title2',body:'body2',author:'author2'};
            stubReturn = '<h3>title<br></h3><h3>body<br></h3><h3>Author: author<br></h3>';
            stubReturn2 = '<h3>title2<br></h3><h3>body2<br></h3><h3>Author: author2<br></h3>';
            sandbox.stub(controllerHelper,'convertProperties')
            .onCall(0).returns(stubReturn)
            .onCall(1).returns(stubReturn2);
            
            expectedValue = '<div><div>'+stubReturn+'<br></div><div>'+stubReturn2+'<br></div></div>';
            returnedValue = await controllerHelper.generateHtmlBody([post,post2]);
            expect(returnedValue).to.be.eql(expectedValue);
        });
        it('should return error message for catch block',async()=>{
            sandbox.stub(controllerHelper,'convertProperties')
            .onCall(0).throws({message: 'error'});
            
            expectedValue = 'error';
            returnedValue = await controllerHelper.generateHtmlBody([post,post2]);
            
            expect(returnedValue).to.be.eql(expectedValue);
        });
        
        afterEach( ()=> {
            sandbox.restore();
        });

    });

    describe('Generate Plain Text Body',()=>{
        let post= {title:'title',body:'body',author:'author'};
        let expectedValue, returnedValue;
        beforeEach(()=>{
            sandbox.restore();
        });
        it('should return single post correctly',async()=>{
            let stubReturn = 'title\nbody\nAuthor: author\n';
            sandbox.stub(controllerHelper,'convertProperties')
            .returns(stubReturn);
            expectedValue = stubReturn+'\n';
            
            returnedValue = await controllerHelper.generatePlainTextBody([post]);
            
            expect(returnedValue).to.be.eql(expectedValue);
        });

        it('should return multiple posts correctly',async()=>{
            let stubReturn1 = 'title\nbody\nAuthor: author\n';
            let stubReturn2 = 'title2\nbody2\nAuthor: author2\n';
            let post2= {title:'title2',body:'body2',author:'author2'};
            sandbox.stub(controllerHelper,'convertProperties')
            .onCall(0).returns(stubReturn1)
            .onCall(1).returns(stubReturn2);
            
            expectedValue = stubReturn1+'\n'+stubReturn2+'\n';
            
            returnedValue = await controllerHelper.generatePlainTextBody([post,post2]);
            
            expect(returnedValue).to.be.eql(expectedValue);
        });

        it('should return error message for catch block',async()=>{
            sandbox.stub(controllerHelper,'convertProperties')
            .throws({message: 'error'});
            expectedValue = 'error';

            returnedValue = await controllerHelper.generatePlainTextBody([post]);
            
            expect(returnedValue).to.be.eql(expectedValue);
        });
        afterEach( ()=> {
            sandbox.restore();
        });

    });
    describe('Convert Posts To Desired Type', ()=>{
        let content_type, dataArray = { body: 'jsonbody'}, returnedValue, expectedValue;
        let htmlBody = '<div>html body<div>', textBody = 'text body\n', jsonBody = { body: 'jsonbody'};
        beforeEach(()=>{
            sandbox.restore();
        });
        it('should return html format if content type is html',async()=>{
            content_type = 'text/html';
            expectedValue = htmlBody;
            sandbox.stub(controllerHelper,'generateHtmlBody')
            .returns(htmlBody);

            returnedValue = await controllerHelper.convertPostsToDesiredType(content_type,dataArray);
            
            sandbox.mock(controllerHelper).expects('generatePlainTextBody').exactly(0);
            expect(returnedValue).to.be.eql(expectedValue);
        });
        it('should return text format if content type is html',async()=>{
            content_type = 'text/plain';
            sandbox.stub(controllerHelper, 'generatePlainTextBody')
            .returns(textBody);
            expectedValue = textBody;
            
            returnedValue = await controllerHelper.convertPostsToDesiredType(content_type,dataArray);
            
            sandbox.mock(controllerHelper).expects('generateHtmlBody').exactly(0);
            expect(returnedValue).to.be.eql(expectedValue);
        });
        it('should return json format if content type is not specified',async()=>{
            content_type = '';
            expectedValue = jsonBody;
            
            returnedValue = await controllerHelper.convertPostsToDesiredType(content_type,dataArray);

            sandbox.mock(controllerHelper).expects('generateHtmlBody').exactly(0);
            sandbox.mock(controllerHelper).expects('generatePlainTextBody').exactly(0);
            expect(returnedValue).to.be.eql(expectedValue);
        });

        it('should return error message for catch block',async()=>{
            content_type = 'text/html';
            expectedValue = 'error';
            sandbox.stub(controllerHelper,'generateHtmlBody')
            .throws({message: 'error'});
            
            returnedValue = await controllerHelper.convertPostsToDesiredType(content_type,dataArray);

            sandbox.mock(controllerHelper)
            .expects('generatePlainTextBody').exactly(0);
            
            expect(returnedValue).to.be.eql(expectedValue);
        });
        afterEach( ()=> {
            sandbox.restore();
        });
    })
});