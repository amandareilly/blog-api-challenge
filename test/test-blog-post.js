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