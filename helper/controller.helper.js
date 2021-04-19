const express = require('express');

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
        console.log(err);
        return err;
    }
    
}
module.exports = {
    convertPostsToDesiredType,
    updatePostContent
}