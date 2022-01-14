const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.headers['access-token'];

  if (!token) {
    return res.status(403).json({'error': 'No token provided'});
  }
  
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
        return res.status(401).json({'unauthorized': 'Unauthorized'});
    }
    req.userId = decoded._id;
    next();
  });
}
