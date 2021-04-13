const Post = require('../models/post.model');
class PostService{
    
    async getAllPost() {
        try{
            const posts = await Post.find();
            return posts;
        } catch(err){
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
        const post = new Post({
            title: reqBody.title,
            body: reqBody.body,
            author: author_name,
            author_email: author_email
        });
        try{
            const post1= await post.save();
            return post1;
        } catch(err){
            return null;
    
        }
    }
    async updatePostById(id, post){
        try{
             await Post.findByIdAndUpdate(id, post);
             return true;

        } catch(err){
            return null;
    
        }
    }
    async deletePostById(id){
        try{

            await Post.findByIdAndDelete(id);
            return "Post Deleted";
        } catch(err){
            return null;
    
        }
    }
}

module.exports = PostService;