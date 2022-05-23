const errorManager = require('http-errors');
const errorHandler = require('../middleware/errorHander');

const getCookie = async (req, res, next) => {
  console.log(req.headers);
  if (req.headers['token']) {
    const Cookie = req.get('token'); return Cookie;
  } else return false;
};

const confirmCookie = async (req, res, cookie) => {
  console.log(String(cookie).length);
  console.log(cookie);
  if (String(cookie).length > 1 && cookie !== false) {
    return true;
  } else {
    const insufficientError = errorManager(
      404,
      'Insufficient Authentication Token!'
    );
    return errorHandler(insufficientError, req, res);
  }
};

module.exports = { getCookie, confirmCookie };
