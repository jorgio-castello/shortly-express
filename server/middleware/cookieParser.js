const parseCookies = (req, res, next) => {

  let cookie = req.headers.cookie || '';

  let sessionObj = {};
  let tempStr = '';
  let key = '';
  let value = '';
  let i = 0;

  while (i < cookie.length) {
    if (cookie[i] === '=') {
      key = tempStr;
      tempStr = '';
    } else if (cookie[i] === ';') {
      value = tempStr;
      tempStr = '';
      sessionObj[key] = value;
      i++;
    } else {
      tempStr += cookie[i];
    }
    i++;
    if (i === cookie.length) { sessionObj[key] = tempStr; }
  }

  req.cookies = sessionObj;
  next();
};

module.exports = parseCookies;