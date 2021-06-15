# simple-blogging-website-backend

## Project Function
User can:
1. See all blogs with author name
2. Create account
3. Log in
4. Create blogs if logged in
5. Update own blogs
6. Delete own blogs

To Run: 

    `npm start`
## URI
To register:  POST http://localhost:5000/user/register 

  Request Body: {"fullname":"", "email":"", "password":""}

To login: POST http://localhost:5000/user/login

  Request Body: {"email":"", "password":""}

To validate login by token: POST http://localhost:5000/user/login/{token}

To see all blogs: GET http://localhost:5000/posts

To see any particular blog: GET http://localhost:5000/posts/{post_id}

To create new blog: POST http://localhost:5000/posts,  Use the token for authentication which is given with response when logged in

   Request Body: {"title":"", "body":""}

To update any blog: PUT http://localhost:5000/posts/{post_id} , Use Token

   Request Body: {"title":""} (if users want to update title)
   
   Request Body: {"body":""} (if users want to update body)
   
   Request Body: {"title":"", "body":""} (if users want to update both)
   
To delete any blog: DELETE http://localhost:5000/posts/{post_id} , Use Token

## Technology Used
Express, MongoDB 

