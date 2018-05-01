'use strict';

const mongoose = require('mongoose');

const uuid = require('uuid');

const blogPostSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true }
    },
    created: { type: Date, required: true }
});

// set timestamp if this is a new entry
blogPostSchema.pre('save', function(next) {
    if (!this.created) {
        this.created = new Date;
    }
    next();
})

// virtual for author name (getter)
blogPostSchema.virtual('authorName').get(function() {
    return `${this.author.firstName} ${this.author.lastName}`.trim();
});

// virtual for author name (setter)
blogPostSchema.virtual('authorName').set(function(name) {
    const parts = name.split(' ');
    this.author.firstName = parts[0];
    this.author.lastName = parts[1];
});

blogPostSchema.methods.serializeWithId = function() {
    return {
        id: this._id,
        title: this.title,
        content: this.content,
        author: this.authorName,
        created: this.created
    };
}

blogPostSchema.methods.serialize = function() {
    return {
        title: this.title,
        content: this.content,
        author: this.authorName,
        created: this.created
    };
}

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = { BlogPost };