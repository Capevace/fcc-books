const { Types } = require('mongoose');
const axios = require('axios');
const { Book, Trade, User } = require('../schemas');
const each = require('async/each');

module.exports = (app) => {
  app.get('/api/trades', (req, res) => {
    if (!req.isAuthenticated()) {
      res.status(401).json({
        status: 401,
        message: 'Please be authenticated.'
      });
      return;
    }

    Trade.find({ $or: [{ from: req.user._id }, { to: req.user._id }] })
      .then(trades => {
        let tradeRequestsByUser = [];
        let tradeRequestsToUser = [];
        let acceptedTrades = [];

        if (trades.length > 0)
          each(trades, (tradedoc, callback) => {
            Book.findOne({ _id: tradedoc.book })
              .then(book => {
                let trade = Object.assign({}, tradedoc._doc)
                trade.bookTitle = book.title;

                if (trade.accepted) {
                  acceptedTrades.push(trade);
                } else if (trade.from.equals(req.user._id)) {
                  tradeRequestsToUser.push(trade);
                } else if (trade.to.equals(req.user._id)) {
                  tradeRequestsByUser.push(trade);
                }

                callback();
              })
              .catch(error => {
                catchError(error, res);
                callback();
              });
          }, function(err){
            if (err) {
              catchError(err, res);
              return;
            }

            res.json({
              status: 200,
              'trades-by-user': tradeRequestsByUser,
              'trades-to-user': tradeRequestsToUser,
              'accepted-trades': acceptedTrades
            });
          });
      })
      .catch(error => catchError(error, res));
  });

  app.post('/api/trade', (req, res) => {
    if (!req.isAuthenticated()) {
      res.status(401).json({
        status: 401,
        message: 'Please be authenticated.'
      });
      return;
    }

    if (!req.body.book) {
      res.status(400).json({
        status: 400,
        message: 'Your request was invalid.'
      });
      return;
    }

    Book.findOne({ _id: req.body.book })
      .then(book => {
        if (!book) {
          res.status(404).json({
            status: 404,
            message: 'Book not found.'
          });
          console.log('gottem');
          // Reject to "break" out of the promise chain
          return Promise.reject();
        }

        if (book.owner.equals(req.user._id)) {
          res.status(400).json({
            status: 400,
            message: 'You can not trade your books to yourself.'
          });
          return Promise.reject();
        }

        Trade.findOne({ book: book._id })
          .then(trade => {
            if (trade) {
              res.status(400).json({
                status: 400,
                message: 'This book is already in an ongoing trade.'
              });
              return;
            }

            Trade.create({
              from: book.owner,
              to: req.user._id,
              book: book._id
            })
              .then(() => res.json({
                status: 200,
                message: 'The Trade was requested.'
              }))
              .catch(error => catchError(error, res));
          })
          .catch(error => catchError(error, res));
      })
      .catch(error => catchError(error, res));
  });

  app.post('/api/trade/:id', (req, res) => {
    if (!req.isAuthenticated()) {
      res.status(401).json({
        status: 401,
        message: 'Please be authenticated.'
      });
      return;
    }

    Trade.findOne({ _id: req.params.id })
      .then(trade => {
        if (!trade) {
          res.status(404).json({
            status: 404,
            message: 'Trade not found.'
          });
          return;
        }

        if (trade.from !== req.user._id && trade.accepted) {
          res.status(401).json({
            status: 401,
            message: 'You cannot accept this trade.'
          });
          return;
        }

        Book.findOne({ _id: trade.book })
          .then(book => {
            if (!book) {
              res.status(404).json({
                status: 404,
                message: 'Book not found.'
              });
              return;
            }

            book.owner = trade.to;
            trade.accepted = true;

            book.save();
            trade.save();

            res.json({
              status: 200,
              message: 'You accepted the trade.'
            });
          })
      })
      .catch(error => catchError(error, res));
  })
};

function catchError(error, res) {
  console.error(error);
  res.status(500).json({
    status: 500,
    message: 'Internal error.'
  });
}
