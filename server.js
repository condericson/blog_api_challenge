const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const {BlogPosts} = require('./models');

const jsonParser = bodyParser.json();
const app = express();

// log the http layer
app.use(morgan('common'));

// (title, content, author, publishDate)
BlogPosts.create('League of Legends', "Check out this legendary play yo!", "FoRealBruh", "1-10-2017");
BlogPosts.create("Overwatch", "Watch this boss play yo!", "FoRealBruh", "1-11-2017");
BlogPosts.create("Unreal Tournament", "The bossness of this play is unreal yo!", "FoRealBruh", "1-12-2017");

app.get('/blog-posts', (req, res) => {
  res.json(BlogPosts.get());
});

app.post('/blog-posts', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author', 'publishDate'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`
      		console.error(message);
      		return res.status(400).send(message);
		}
	}
	const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
	res.status(201).json(item);
})

app.put('/blog-posts/:id', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author', 'publishDate', 'id'];
	for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
  	const message = (
  		`Request path id (${req.parms.id}) and request body id (${req.body.id}) must match`);
  	console.error(message);
  	return res.statu(400).send(message);
  }
  console.log(`Updating blog post \`${req.params.id}\``);
  const updatedItem = BlogPosts.update({
  	id: req.params.id,
  	title: req.body.title,
  	content: req.body.content,
  	author: req.body.author,
  	publishDate: req.body.publishDate
  });
  res.status(204).json(updatedItem);
});

app.delete('/blog-posts/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted blog post \`${req.params.id}\``)
	res.status(204).end();
});


app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
}); 