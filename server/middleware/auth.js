const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  //check if req.cookies['shortlyid'] doesn't exist
  if (!req.cookies['shortlyid']) {
    //Create a hash and add it to dbsh
    return models.Sessions.create()
      .then(hash => {
        return models.Sessions.get({id: hash.insertId})
          .then(data => {
            req.session = {
              'hash': data.hash
            };
            res.cookie('shortlyid', data.hash);
            next();
          });
      });
  } else {
    req.session = {
      'hash': req.cookies['shortlyid']
    };
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