const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');
const should = chai.should();
chai.use(chaiHttp);

describe('Blog Posts', function() {
  before(function() {
    return runServer();
  });
  after(function() {
    return closeServer();
  });

  it('should list blog posts on GET', function() {
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.at.least(1); //this might be wrong
        const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
        });
      });
  });

  it('should add an item on POST', function() {
    const newItem = {title: 'boss', content: 'bossness', author: 'connor', publishDate: '1.22.2017'}
    return chai.request(app)
      .post('/blog-posts')
      .send(newItem)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('id', 'title', 'content', 'author', 'publishDate');
        res.body.id.should.not.be.null;
        res.body.should.deep.equal(Object.assign(newItem, {id: res.body.id}));
      });
  });

  it('should update items on PUT', function() {
    const updateData = {
      title: 'test',
      content: 'this is a test of the blog system',
      author: 'tester',
      publishDate: '1-22-2017'
    };
    console.log(updateData);
    return chai.request(app)
    .get('/blog-posts')
    .then(function(res) {
      console.log("THIS IS THE CONSOLE LOG " + res + " " + updateData.id);
      updateData.id = res.body[0].id;
      return chai.request(app)
        .put(`/blog-posts/${updateData.id}`)
        .send(updateData);
    })
    .then(function(res) {
      console.log(res.body);
      /*res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');*/
      res.body.should.deep.equal(updateData);
    });
  });

  it('should delete recipes on DELETE', function() {
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        return chai.request(app)
          .delete(`/blog-posts/${res.body[0].id}`);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });
});
