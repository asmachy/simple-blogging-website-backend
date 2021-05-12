const Post = require('../models/post.model');
async function getAllPost() {
    try{
        const posts = await Post.find();
        return {data: posts, status: 200};
    } catch(err){
        return {data: 'server failed', status: 500};
        // return {data: err.message, status: 500};
    }
}
async function getPostById(id){
    try{
        const post = await Post.findById(id);
        return {data: post, status: 200};
    } catch(err){
        return {data: 'server failed', status: 500};
        // return {data: err.message, status: 500};
    }
}
async function createNewPost(reqBody, author_name, author_email){
    try{
        const post = new Post({
            title: reqBody.title,
            body: reqBody.body,
            author: author_name,
            author_email: author_email
        });
        await post.save();
        return {data: "Post Created", status: 201};
    } catch(err){
        return {data: 'server failed', status: 500};
        // return {data: err.message, status: 500};
    }
}
async function updatePostById(id, post){
    try{
        await Post.findByIdAndUpdate(id, post,{
            useFindAndModify: false
        });
        return {data: "Post Updated", status: 201};
    } catch(err){
        return {data: 'server failed', status: 500};
        // return {data: err.message, status: 500};
    }
}
async function deletePostById(id){
    try{
        await Post.findByIdAndDelete(id,{
            useFindAndModify: false
        });
        return {data: "Post Deleted", status: 200};
    } catch(err){
        return {data: 'server failed', status: 500};
        // return {data: err.message, status: 500};
    }
}

module.exports = {
    getAllPost,
    getPostById,
    createNewPost,
    updatePostById,
    deletePostById,
    Post   
};