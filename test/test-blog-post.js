const chai = require('chai');
const chaiHttp = require('chai-http');
console.log(1);
const { app, runServer, closeServer } = require('../server');
console.log(2);
const expect = chai.expect;
console.log(3);
chai.use(chaiHttp);
console.log(4);
describe('Blog Posts', function() {
    console.log(5);
    //run server
    before(function() {
        console.log(6);
        return runServer();
    });

    //close server after tests run
    after(function() {
        console.log(7);
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
                console.log(8);
                const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
                res.body.forEach(function(item) {
                    expect(item).to.be.a('object');
                    expect(item).to.include.keys(expectedKeys);
                });
            });
    });
});