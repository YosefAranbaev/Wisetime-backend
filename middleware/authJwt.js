const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  console.log(req.headers)
  const token = req.headers.authorization.split(' ')[1];

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
