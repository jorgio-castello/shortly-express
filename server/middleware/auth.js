const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {

  //Check if there's a shortly cookie using Promise.resolve
  Promise.resolve(req.cookies['shortlyid'])
    .then(hash => {
      if (!hash) {
        throw hash;
      }
      return models.Sessions.get({ hash });
    })
    .then(session => {
      if (!session) {
        throw session;
      }
      return session;
    })
    .catch(() => {
      return models.Sessions.create()
        .then(hash => {
          return models.Sessions.get({id: hash.insertId});
        })
        .then(data => {
          res.cookie('shortlyid', data.hash);
          return data;
        });
    })
    .then(session => {
      req.session = session;
      next();
    });
};
//Check to see if there's a hash / session, and if not throw errors to the catch
//The catch will start a new session, and assign a cookie to the response w/ the hash
//Session will be re-assigned to req.session, invoke next
module.exports.validateAuthentication = function(req, res, next) {
  if (!models.Sessions.isLoggedIn(req.session)) {
    res.redirect('/login');
  } else {
    next();
  }
};



/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

//1. If someone visits the site and is not authenticated, initial get request
//1a. We want to create a session and send the session hash as a cookie in the response headers
//2. If we receive a login / signup request along with a cookie we recognize, destroy current cookie and create new
//authenticated cookie