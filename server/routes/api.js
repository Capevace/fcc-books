const path = require('path');
const { isAuthenticatedStatus } = require('./is-authenticated');
const { User } = require('../schemas');

const bookRoutes = require('./books');
const tradeRoutes = require('./trades');

module.exports = (app, passport) => {
  bookRoutes(app);
  tradeRoutes(app);

  app.get('/auth/user', (req, res) => {
    if (!req.user) {
      res.json({});
      return;
    }

    res.json({
      user: {
        _id: req.user._id,
        twitterId: req.user.twitter.id,
        displayName: req.user.info.displayName,
        state: req.user.info.state,
        city: req.user.info.city,
        username: req.user.twitter.username
      }
    });
  });

  app.post('/auth/user/settings', (req, res) => {
    if (!req.isAuthenticated()) {
      res.json({});
      return;
    }

    User.findOne({ _id: req.user._id })
      .then(user => {
        if (!user) {
          res.json({});
          return;
        }

        user.info.displayName = req.body.displayName;
        user.info.city = req.body.city;
        user.info.state = req.body.state;
        user.save(err => {
          if (err) {
            console.log(error);
            res.json({});
            return;
          }

          // Update user in session
          req.login(user, err => {
            if (err) {
              console.log(error);
              res.json({});
              return;
            }

            res.json({
              user: {
                _id: user._id,
                twitterId: user.twitter.id,
                displayName: user.info.displayName,
                state: user.info.state,
                city: user.info.city,
                username: user.twitter.username
              }
            });
          });
        });

      });
  });

  app.post('/login', (req, res, next) => { console.log('here'); next();}, (req, res) => {
    passport.authenticate('local-login', (err, user, info) => {
      console.log(err, user, info);

      return res.json({});
    });
  });

  // handle the callback after twitter has authenticated the user
  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect : '/',
    failureRedirect : '/'
  }));
};
