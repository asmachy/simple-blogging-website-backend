const express = require('express');
const router = express.Router();
const postController = require("../controllers/post.controller");
const queryUserHelper = require("../helper/query.user.helper");
const queryPostHelper = require("../helper/query.post.helper");

router.get('/', postController.getPosts);
router.post('/',[queryPostHelper.isValidNewPostInfo, queryUserHelper.isLoggedIn],postController.createPost);

router.get('/:id',[queryPostHelper.isValidPostId],postController.getPost);
router.put('/:id',[queryPostHelper.isValidPostId, queryUserHelper.isLoggedIn,
    queryPostHelper.isValidAuthor],postController.updatePost);
router.delete('/:id',[queryPostHelper.isValidPostId, queryUserHelper.isLoggedIn,
    queryPostHelper.isValidAuthor],postController.deletePost);


module.exports = router;