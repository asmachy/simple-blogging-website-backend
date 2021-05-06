let request = require('supertest');
let app = require('../../index');
// let postRoute = require('../../routes/post.route');

describe('Post Related Routes',()=>{
    describe('Get All Post',()=>{
        it('Should return dummy posts in json format',()=>{
            let posts = [{_id:'608833d21bc61c30b8f060a6',
                title:"First Post",
                body:"abc new post ",
                author:"asma",
                author_email:"asmachy@gmail.com",
                __v:0},
                {
                    id:'6092670c5a05410d28726366',
                    title: 'sdx',
                    body: 'xvcdx',
                    author: 'asma',
                    author_email: 'asma@gmail.com',
                    __v:0
                }
            ]
            
            request(app).get('/')
            .expect(500)
            .expect(null);
        });
    });
});