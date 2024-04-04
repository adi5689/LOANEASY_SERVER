const jwt = require('jsonwebtoken');
const User = require('../models/User');

const checkAdmin = async (req, res, next) => {
  
    try {
      const token = req.header('Authorization').replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.user.id);

      if(!user || !user.isAdmin) {
        return res.status(403).json({msg:'Admin Access required!'});
      }
      next();
    } catch(err) {
        res.status(401).json({msg: 'Token is not valid!'});
    }
};

module.exports = checkAdmin;