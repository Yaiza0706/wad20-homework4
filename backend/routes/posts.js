const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const PostModel = require('../models/PostModel');


router.get('/', authorize, (request, response) => {

    // Endpoint to get posts of people that currently logged in user follows or their own posts

    PostModel.getAllForUser(request.currentUser.id, (postIds) => {

        if (postIds.length) {
            PostModel.getByIds(postIds, request.currentUser.id, (posts) => {
                response.status(201).json(posts)
            });
            return;
        }
        response.json([])

    })

});

router.post('/', authorize,  (request, response) => {

    // Endpoint to create a new post
   
    /* Some error handeling:
        - post should have at least one atribute (media/text)
        - if url is defined then media type can not be undefined 
      Would be nice: 
        - would check if url is valid
        - would check if url media type is the same as media type defined by user
    */
    if ((request.body.text === null && request.body.media.url === null )
    || (request.body.text === undefined && request.body.media.url === undefined)
    || (request.body.text === '' && request.body.media.url === '')
    || (request.body.media.url && request.body.media.type === undefined)){ 
        response.status(400).json({
            code: 'post_can_not_be_empty',
            message: "Post can not be empty, plase specify at least one atribute"
        });
        console.log("Post can not be empty");
        return;
    }
    
    let params = {
        userId: request.currentUser.id,
        text: request.body.text,
        media: request.body.media,
    };

    PostModel.create(params, (addPost) => {
        response.status(201).json(addPost);
    });

});


router.put('/:postId/likes', authorize, (request, response) => {

    let postId = request.params.postId;
    let userId = request.currentUser.id;

    PostModel.like(userId, postId, (updatedPost) => {
        response.status(200).json(updatedPost)
    });

    // Endpoint for current user to like a post
});

router.delete('/:postId/likes', authorize, (request, response) => {

    let postId = request.params.postId;
    let userId = request.currentUser.id;

    PostModel.unlike(userId, postId, (updatedPost) => {
        response.status(200).json(updatedPost)
    });

    // Endpoint for current user to unlike a post

});

module.exports = router;
