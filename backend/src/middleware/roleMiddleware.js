const { errorResponse } = require('../utils/apiResponse');

const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return errorResponse(res, 403, 'Access denied: Admins only');
  }
  next();
};

module.exports = { authorizeAdmin };