const express = require('express');
const router = express.Router();
const postController = require("../controllers/post.controller");
const queryUserHelper = require("../helpers/query.user.helper");
const queryPostHelper = require("../helpers/query.post.helper");

router.get('/', postController.getPosts);
router.post('/',[queryPostHelper.isValidNewPostFormat, queryUserHelper.isLoggedIn],postController.createPost);

router.get('/:id',[queryPostHelper.isValidPostId],postController.getPost);
router.put('/:id',[queryPostHelper.isValidPostId, queryUserHelper.isLoggedIn,
    queryPostHelper.isValidAuthor],postController.updatePost);
router.delete('/:id',[queryPostHelper.isValidPostId, queryUserHelper.isLoggedIn,
    queryPostHelper.isValidAuthor],postController.deletePost);


module.exports = router;