//our original logic, used it as a template to refactor with the solution logic

module.exports.createSession = (req, res, next) => {
  //check if req.cookies['shortlyid'] doesn't exist
  //console.log(req.cookies);

  //  CHECKS IF THE REQUEST HAS A COOKIE FOR THIS SITE
  if (!req.cookies['shortlyid']) {
    //IF NOT, CREATES A HASH IN THE SESSIONS TABLE, ASSIGN THE HASH TO THE SESSIONS AND RESPONSE COOKES (NO USERID)
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

  // IF REQUEST DOES HAVE A COOKIE FOR THIS SITE -->
  } else {
    req.session = {
      'hash': req.cookies['shortlyid']
    };
    return models.Sessions.get({'hash': req.session.hash})
      .then(sessionCheck => {

        // IF THE REQUEST HAS A SHORTLY KEY BUT NOT RECORDED VALUE IN THE SESSION TABLE->
        if (!sessionCheck) {
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
        }
        // IF THE REQUEST HAS A HASH THAT IS IN SESSIONS TABLE THAT HAS A USER ID
        if (sessionCheck.userId) {
          return models.Users.get({'id': sessionCheck.userId})
            .then(userCheck => {
              req.session.user = {
                username: userCheck.username
              };
              req.session.userId = userCheck.id;
              var userID = req.session.userId;
              console.log('userID', userID);
              return models.Sessions.get({'hash': req.session.hash})
                .then(result => {
                  console.log('result: ', result);
                  res.cookie('shortlyid', req.cookies['shortlyid']);
                  res.cookie('username', userCheck.username);
                  next();
                });
            });

        // IF REQUEST HAS A HASH IN THE SESSION TALBE BUT DOES NOT HAVE A USER ID
        } else {
          res.cookie('shortlyid', req.cookies['shortlyid']);
          next();
        }
      }).catch(() => {});
  }
};