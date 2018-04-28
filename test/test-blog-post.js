const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);
describe('Blog Posts', function() {
    //run server
    before(function() {
        return runServer();
    });

    //close server after tests run
    after(function() {
        return closeServer();
    });

    // GET /blog-posts
    // 1. Should be json
    // 2. Body should be array
    // 3. Body should have at least 1 element (3 entered at init)
    // 4. Body element should be object
    // 5. Object should have keys `id`, `title`, `content`,
    //    `author`, and `publishDate`
    it('should list blog posts on GET', function() {
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res) {
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.at.least(1);
                const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
                res.body.forEach(function(item) {
                    expect(item).to.be.a('object');
                    expect(item).to.include.keys(expectedKeys);
                });
            });
    });

    // POST /blog-posts
    // 1. Add an item
    // 2. Should return 201
    // 3. Should return a json object
    // 4. Response should include keys `id`, `title`, `content`,
    //    `author`, and `publishDate`
    // 5. `id` should not be null
    // 6. Response body should be deep equal to the item passed to post
    //    plus the returned id and publishDate
    it('should add a blog post on POST', function() {
        const newPost = { title: 'a title', content: 'some content', author: 'author name' };
        return chai.request(app)
            .post('/blog-posts')
            .send(newPost)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body.id).to.not.equal(null);
                expect(res.body).to.deep.equal(Object.assign(newPost, { id: res.body.id, publishDate: res.body.publishDate }));
            });
    });
});