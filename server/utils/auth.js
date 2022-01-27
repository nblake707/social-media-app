const jwt = require("jsonwebtoken");

// enables the server to verify whether it recognizes the token
const secret = "mysecretshhh";
const expiration = "2h";

module.exports = {
  // adds user's username, email, and _id properties to the token
  signToken: function ({ username, email, _id }) {
    // destructuring user object
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
  authMiddleware: function ({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // separate "Bearer" from "<tokenvalue>"
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    // if no token, return request object as is
    if (!token) {
      return req;
    }

    /* used try/ catch bc don't want error thrown on every request. Users with invalid tokens 
        should still be able to see all thoughts. 
    */
    try {
      /*  decode and attach user data to request object - if this secret does not
            match the secret that was used with jwt.sign(). the object wont be decoded. 
            when it fails, error is thrown 
      */
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log("Invalid token");
    }

    // return updated request object
    return req;
  },
};
