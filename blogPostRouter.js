'use strict';

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { PORT, DATABASE_URL } = require('./config');
const { BlogPost } = require('./models');

//get all blog posts
router.get('/', (req, res) => {
    console.log('get all posts identified');
    BlogPost
        .find()
        .then(BlogPost => res.json(BlogPost.map(post => post.serializeWithId())))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' })
        });
});

//get a specific blog post
router.get('/:id', jsonParser, (req, res) => {
    BlogPost
        .findById(req.params.id)
        .then(blogPost => res.json(blogPost.serialize()))
        .catch(err => {
            console.err(err);
            res.status(500).json({ message: 'Internal server error' })
        });
});

//create new blog post
router.post('/', jsonParser, (req, res) => {
    //ensure `title`, `content`, and `author are in request body
    const requiredFields = ['title', 'content', 'author'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    //ensure `author` is an object and contains `firstName` and `lastName`
    const authorRequiredFields = ['firstName', 'lastName'];
    if (!typeof(req.body.author) === "object") {
        const message = `The \`author\` parameter must be an object with keys \`firstName\` and \`lastName\`.`;
        console.error(message);
        return res.status(400).send(message);
    }
    for (let i = 0; i < authorRequiredFields.length; i++) {
        const field = authorRequiredFields[i];
        if (!(field in req.body.author)) {
            const message = `Missing \`${field}\` in \`author\` parameter.`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    //create item and persist it
    // const item = BlogPost.create(req.body.title, req.body.content, req.body.author);
    BlogPost.create({
            title: req.body.title,
            content: req.body.content,
            author: {
                firstName: req.body.author.firstName,
                lastName: req.body.author.lastName
            }
        })
        .then(post => res.status(201).json(post.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        });
});

//update existing blog post
router.put('/:id', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author', 'id'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    if (req.params.id !== req.body.id) {
        const message = (
            `Request path id (${req.params.id}) and request body id `
            `(${req.body.id}) must match`);
        console.error(message);
        return res.status(400).send(message);
    }
    //ensure `author` is an object and contains `firstName` and `lastName`
    const authorRequiredFields = ['firstName', 'lastName'];
    if (!typeof(req.body.author) === "object") {
        const message = `The \`author\` parameter must be an object with keys \`firstName\` and \`lastName\`.`;
        console.error(message);
        return res.status(400).send(message);
    }
    for (let i = 0; i < authorRequiredFields.length; i++) {
        const field = authorRequiredFields[i];
        if (!(field in req.body.author)) {
            const message = `Missing \`${field}\` in \`author\` parameter.`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    console.log(`Updating blog post \`${req.params.id}\``);
    const updatedPost = BlogPost.update({
            id: req.params.id,
            title: req.body.title,
            author: req.body.author,
            content: req.body.content
        },
        function(err, numAffected) {
            if (err) console.log(err);
        });
    res.status(204).end();
})

//delete existing blog post
router.delete('/:id', (req, res) => {
    BlogPost.delete(req.params.id);
    console.log(`Deleted blog post \`${req.params.id}\``);
    res.status(204).end();
});

module.exports = router;