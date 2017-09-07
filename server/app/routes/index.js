// routes/index.js
const parseRoutes = require('./parse_routes');
module.exports = function(app, db) {
  parseRoutes(app, db);
  // Other route groups could go here, in the future
};
