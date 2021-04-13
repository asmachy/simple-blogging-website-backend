const express = require('express');
const jwt = require('jsonwebtoken');
const PostService = require("../services/post.service");
const postService = new PostService();
const UserService = require("../services/user.service");
const userService = new UserService();
async function tokenValidation(token){
    try{
        const verified = jwt.verify(token,process.env.jwtSecret);
        let user = verified;
        user = await userService.getUserByEmail(user.email);
        return user;
    } catch(err){
        return {message: err};
    }
}

async function authentication (bearerToken){
    try{ 
        const token = await bearerToken.substring(7, bearerToken.length);
        const user = await tokenValidation(token);
        return user;
        
    } catch(err){
        return {message: err};
    }
    
}

async function isValidUser(post, author_email ){
    try{
        if(post.author_email!=author_email) return false;
        else return true;
    } catch(err){
        return {message: err};
    }
    
}


async function updatePostContent(reqBody,post){
    try{
        if(reqBody.title!=null)  post.title = reqBody.title;
        if(reqBody.body!=null)  post.body = reqBody.body;
        return post;
    } catch(err){
        return {message: err};
    }
    
}

async function convertProperties(post, seperation,seperationEnd, newLine){
    try{
        
        let postProperties=seperation+post.title+newLine+seperationEnd;
        postProperties+=seperation+post.body+newLine+seperationEnd;
        postProperties+=seperation+"Author: "+post.author+newLine+seperationEnd;
        return postProperties;
    } catch(err){
        return {message: err};
    }
    
}

async function generateHtmlBody(dataArray){
    try{
        let htmlBody="<div>";
        await dataArray.forEach(async function(element) {
            let postProperties = await convertProperties(element,"<h3>","</h3>","<br>");
            htmlBody+="<div>"+postProperties+"<br></div>";
         });
         htmlBody+= "</div>";
        return htmlBody;
    }catch(err){
        return {message: err};
    }
    
    
}
async function generatePlainTextBody(dataArray){
    try{
        let textBody="";
        await dataArray.forEach(async function(element) {
            let objProperties = await convertProperties(element,"","","\n");
            textBody+=objProperties+"\n";
         });
      return textBody;
    }catch(err){
        return {message: err};
    }
    
}

async function convertPostsToDesiredType(content_type, dataArray){
    try{
        if(content_type.toLowerCase().includes("html")){
            return generateHtmlBody(dataArray);
        }
        else if(content_type.toLowerCase().includes("text")){
            return generatePlainTextBody(dataArray);
        }
        else
            return dataArray;
    }catch(err){
        return {message: err};
    }
    
}
module.exports = {
    tokenValidation,
    authentication,
    isValidUser,
    convertPostsToDesiredType,
    updatePostContent
}