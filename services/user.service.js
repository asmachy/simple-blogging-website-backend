const User = require('../models/user.model');
const bcryptjs = require("bcryptjs");
class PostService{
      async createNewUser(reqBody){
        try{
            const hashedpassword = await bcryptjs.hash(reqBody.password, 10)
            const user = new User({
            fullname: reqBody.fullname,
            email: reqBody.email,
            password: hashedpassword
        });
            const user1= await user.save();
            return user1;
        } catch(err){
            return {"message": "Oops! Something Happend!"};
    
        }
      }
      async getAllUser() {
        try{
            const users = await User.find();
            return users;
        } catch(err){
            return {"message": "Oops! Something Happend!"};
        }
      }
      async getUserByEmail(email){
        try{
            const user = await User.findOne({email:email});
            return user;
        } catch(err){
            return {"message": "Oops! Something Happend!"};
        }
      }
}

module.exports = PostService;