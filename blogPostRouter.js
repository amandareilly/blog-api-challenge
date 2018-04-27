const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { BlogPosts } = require('./models');

//create a few blog posts so we have something
//to work with
BlogPosts.create('My Title 1', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates amet earum mollitia, repellat maxime repellendus ex debitis? Similique cupiditate tenetur porro voluptas iusto magnam explicabo commodi distinctio? Ut, ipsam voluptates?', 'Anna Andrews');
BlogPosts.create('My Title 2', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates amet earum mollitia, repellat maxime repellendus ex debitis? Similique cupiditate tenetur porro voluptas iusto magnam explicabo commodi distinctio? Ut, ipsam voluptates?', 'Billy Burns');
BlogPosts.create('My Title 3', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates amet earum mollitia, repellat maxime repellendus ex debitis? Similique cupiditate tenetur porro voluptas iusto magnam explicabo commodi distinctio? Ut, ipsam voluptates?', 'Carrie Crawford');

//get all blog posts
router.get('/', (req, res) => {
    res.json(BlogPosts.get());
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
    let item;
    if (req.body.hasOwnProperty('publishDate')) {
        item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
    } else {
        item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
    }
    res.status(201).json(item);
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

    console.log(`Updating blog post \`${req.params.id}\``);
    const updatedPost = BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        author: req.body.author,
        content: req.body.content
    });
    console.log(updatedPost);
    res.status(204).end();
})

//delete existing blog post
router.delete('/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blog post \`${req.params.id}\``);
    res.status(204).end();
});

module.exports = router;