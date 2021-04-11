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
    async createNewPost(reqBody, user){
        const post = new Post({
            title: reqBody.title,
            body: reqBody.body,
            author: user.fullname,
            author_email: user.email
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
            return err;
    
        }
    }
    async deletePostById(id){
        try{

            await Post.findByIdAndDelete(id);
            return "Post Deleted";
            
            // if(!mongoose.Types.ObjectId.isValid(id)) return "Post Not Found...";
            // const post= await Post.findById(id);
            
            // if(post===null)
            //     return "Post Not Found";
            // if(this.isValidUser(post, user_email)) {
            // await Post.findByIdAndDelete(id);
            // return "Post Deleted";
            // }
            // else{
            //     return "Access Denied!";
            // }
        } catch(err){
            // return {"message": "Oops! Something Happend!"};
            return err;
    
        }
    }
}

module.exports = PostService;