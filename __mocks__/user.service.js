class UserService{
    // async createNewUser(reqBody){
    //   try{
    //       let hashedpassword="";
    //       if(reqBody.password!="")
    //       hashedpassword = await bcryptjs.hash(reqBody.password, 10);
    //       const user = new User({
    //       fullname: reqBody.fullname,
    //       email: reqBody.email,
    //       password: hashedpassword
    //   });
    //       const user1= await user.save();
    //       return "Registration Successfull";
    //   } catch(err){
    //       return err.message;
  
    //   }
    // }
    // async getAllUser() {
    //   try{
    //       const users = await User.find();
    //       return users;
    //   } catch(err){
    //       return err.message;
    //   }
    // }
    async getUserByEmail(email){
          if(email == 'deletedUser@email.com') return null;
          else if(email=='existedUser@gmail.com') return {fullname: 'existed user', email: this.email, password: 'password'};
      
          // try{
      //     console.log("ashche");
      //     if(email == 'deletedUser@email.com') return null;
      //     else if(email=='existedUser@email.com') return {fullname: 'existed user', email: this.email, password: 'password'};
      // } catch(err){
      //     console.log('err from user service: ', err.message);
      //     return null;
      //     // return Promise.reject(null);
      // }
    }
}

module.exports = UserService;