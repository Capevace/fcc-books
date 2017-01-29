const { Types } = require('mongoose');
const axios = require('axios');
const { Book, User } = require('../schemas');

module.exports = (app) => {
  app.get('/api/books', (req, res) => {
    const condition = req.query.user
      ? { owner: req.query.user }
      : {};

    Book.find(condition)
      .then(results => res.json({
        books: results
      }))
      .catch(error => catchError(error, res));
  });

  app.get('/api/book/:id', (req, res) => {
    console.log(req.params);
    Book.findOne({ _id: req.params.id })
      .then(book => {
        if (!book) {
          res.status(404).json({
            status: 200,
            message: 'Book not found.'
          });
          return;
        }

        User.findOne({ _id: book.owner })
          .then(user => {
            if (!user) {
              catchError('User not found for a book.', res);
              return;
            }

            res.json({
              status: 200,
              book: Object.assign({}, book._doc, {
                ownerDisplayName: user.info.displayName
              })
            });
          })
      })
      .catch(error => catchError(error, res));
  });

  app.post('/api/book', (req, res) => {
    if (!req.body.title) {
      res.status(400).json({
        status: 400,
        message: 'Please supply a name'
      });
      return;
    }

    if (!req.isAuthenticated()) {
      res.status(401).json({
        status: 401,
        message: 'Please be authenticated.'
      });
      return;
    }
    //http://covers.openlibrary.org/b/ISBN/0321356683-M.jpg
    axios
      .get('https://openlibrary.org/search.json', {
        params: {
          q: req.body.title
        }
      })
      .then(result => {
        if (result.data.docs.length === 0) {
          res.status(404).json({
            status: 404,
            message: 'Book not found.'
          });
          return;
        }

        const book = result.data.docs[0];
        Book.create({
          title: book.title_suggest,
          isbn: book.isbn[0],
          owner: req.user._id
        })
          .then(() => res.json({
            status: 200,
            message: 'The book was added.'
          }))
          .catch(error => catchError(error, res));
      })
      .catch(error => catchError(error, res));
  });
  // https://openlibrary.org/search.json?q=eloquent
};

function catchError(error, res) {
  console.error(error);
  res.status(500).json({
    status: 500,
    message: 'Internal error.'
  });
}
