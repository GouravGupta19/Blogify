const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      return next();
    }

    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
    } catch (error) {}
    return next();
  };
}

module.exports = checkForAuthenticationCookie;
// This middleware checks for the presence of an authentication cookie
// and validates it. If the cookie is valid, it adds the user payload to the request object.
// If the cookie is not present or invalid, it simply calls next() without modifying the request object.
