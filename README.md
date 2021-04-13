# simple-blogging-website-backend

# Project Function
User can:
1. See all blogs with author name
2. Create account
3. Log in
4. Create blogs if logged in
5. Update own blogs
6. Delete own blogs

To Run: 

    npm start
# URI
To register:  POST http://localhost:3000/user/register 

  Request Body: {"fullname":"", "email":"", "password":""}

To login: POST http://localhost:3000/user/login

  Request Body: {"email":"", "password":""}

To see all blogs: GET http://localhost:3000/posts

To see any particular blog: GET http://localhost:3000/posts/{post_id}

To create new blog: POST http://localhost:3000/posts,  Use the token for authentication which is given with response when logged in

   Request Body: {"title":"", "body":""}

To update any blog: PUT http://localhost:3000/posts/{post_id} 

   Request Body: {"title":""} (if user want to update title)
   
   Request Body: {"body":""} (if user want to update body)
   
   Request Body: {"title":"", "body":""} (if user want to update both)
   
To delete any blog: DELETE http://localhost:3000/posts/{post_id}

# Technology Used
Express, MongoDB Atlas (Cloud)


