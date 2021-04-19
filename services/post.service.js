const Post = require('../models/post.model');
class PostService{
    
    async getAllPost() {
        try{
            const posts = await Post.find();
            return posts;
        } catch(err){
            console.log(err);
            return null;
        }
    }
    async getPostById(id){
        try{
            const post = await Post.findById(id);
            return post;
        } catch(err){
            console.log(err);
            return null;
        }
    }
    async createNewPost(reqBody, author_name, author_email){
        try{
            const post = new Post({
                title: reqBody.title,
                body: reqBody.body,
                author: author_name,
            author_email: author_email
            });
            const post1= await post.save();
            return "Post Created";
        } catch(err){
            console.log(err);
            return err.message;
    
        }
    }
    async updatePostById(id, post){
        try{
             await Post.findByIdAndUpdate(id, post,{
                useFindAndModify: false
             });
             return "Post Updated";

        } catch(err){
            console.log(err);
            return "Error in Server";
    
        }
    }
    async deletePostById(id){
        try{

            await Post.findByIdAndDelete(id,{
                useFindAndModify: false
             });
            return "Post Deleted";
        } catch(err){
            console.log(err);
            return "Error in Server";
    
        }
    }
}

module.exports = PostService;