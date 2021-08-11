# simple-blogging-website-backend

It is a backend project of a simple blogging website

## Project Function
User can:
1. See all blogs with author name
2. Create account
3. Log in
4. Create blogs if logged in
5. Update own blogs
6. Delete own blogs

## How to Run
1. Clone this repository
2. Install mongodb in your local machine and make sure that it is running on port 27017.
3. Go to the repository from command prompt or power shell (windows) or from terminal (linux).
4. Make your own ".env" file and include port and database link in that file.
5. Run command: `npm install`
6. Run command: `npm start`

## Features
To register: 

    POST /user/register 

    {

    "fullname":"user name", 

    "email":"user_email", 

    "password":"user_password"

    }

To login: 

    POST /user/login

    {

    "email":"valid_email",

    "password":"valid_password"

    }

To validate login by token: 

    POST /login/token
    Authorization: {valid_token}

To see all blogs: 

    GET /posts

To see any particular blog: 
    
    GET /posts/{post_id}

To create new blog: 

    POST /posts

    Authorization: {valid_token}

    {

    "title":"post title", 

    "body":"post body"

    }

To update any blog: 
  
    PUT /posts/{post_id}

    Authorization: {valid_token}

    {

    "title":"post_title"

    } (if users want to update title)

    {

    "body":"post_body"

    } (if users want to update body)

    {

    "title":"post_title",

    "body":"post_body"

    } (if users want to update both)
   
To delete any blog: 

    DELETE /posts/{post_id}

    Authorization: {valid_token}`
  
## Technology Used
Express, MongoDB 
