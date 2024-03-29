const express = require('express');
async function updatePostContent(reqBody,post){
        
        if(reqBody.title) {
            post.title = reqBody.title;
        } 
        else throw({message: "Title can not be empty!!"})
        if(reqBody.body){
            post.body = reqBody.body;
        }  
        else throw({message: "Body can not be empty!!"})
        return post;
  
}

async function convertProperties(post, seperation,seperationEnd, newLine){
    try{
        let postProperties=seperation+post.title+newLine+seperationEnd;
        postProperties+=seperation+post.body+newLine+seperationEnd;
        postProperties+=seperation+"Author: "+post.author+newLine+seperationEnd;
        return postProperties;
    } catch(err){
        return err.message;
    }
    
}

async function generateHtmlBody(dataArray){
    try{
        let htmlBody="<div>";
        let iteration, arrayLength= dataArray.length;
        for(iteration = 0; iteration<arrayLength;iteration++){
            let postProperties = await this.convertProperties(dataArray[iteration],"<h3>","</h3>","<br>");
            htmlBody+="<div>"+postProperties+"<br></div>";
        }
         htmlBody+= "</div>";
        return htmlBody;
    }catch(err){
        return err.message;
    }
    
    
}
async function generatePlainTextBody(dataArray){
    try{
        let textBody="";
        let iteration, arrayLength= dataArray.length;
        for(iteration = 0; iteration<arrayLength;iteration++){
            let objProperties = await this.convertProperties(dataArray[iteration],"","","\n");
            textBody+=objProperties+"\n";
        }
      return textBody;
    }catch(err){
        return err.message;
    }
    
}

async function convertPostsToDesiredType(content_type, dataArray){
    try{
        if(content_type.toLowerCase().includes("html")){
            return this.generateHtmlBody(dataArray);
        }
        else if(content_type.toLowerCase().includes("text/plain")){
            return this.generatePlainTextBody(dataArray);
        }
        else
            return dataArray;
    }catch(err){
        return err.message;
    }
    
}

module.exports = {
    updatePostContent,
    convertProperties,
    generateHtmlBody,
    generatePlainTextBody,
    convertPostsToDesiredType,
}