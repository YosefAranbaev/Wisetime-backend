const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
    let token = req.headers['access-token'];
  
    if (!token) {
      return res.status(403).json({'unauthorized': 'NO token provided!'});
    }
    
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({'unauthorized': 'Unauthorized'});
        }
        req.userId = decoded._id;
        next();
      });
}
