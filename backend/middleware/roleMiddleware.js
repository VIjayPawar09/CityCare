// middleware/roleMiddleware.js
const roleMiddleware = (roles) => {
  return (req, res, next) => {
    // roles must be an array of allowed role strings, e.g. ['admin']
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permission.' });
    }
    next();
  };
};

module.exports = roleMiddleware;
