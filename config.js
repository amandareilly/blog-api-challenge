'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/blog-api-challenge';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-blog-api-challenge';
exports.PORT = process.env.PORT || 8080;