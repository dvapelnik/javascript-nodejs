
var mountHandlerMiddleware = require('lib/mountHandlerMiddleware');

exports.init = function(app) {
  app.use(mountHandlerMiddleware('/courses', __dirname));
};

exports.Course = require('./models/course');
exports.CourseGroup = require('./models/courseGroup');

exports.onPaid = require('./lib/onPaid');

exports.getAgreement = require('./lib/getAgreement');

exports.createOrderFromTemplate = require('./lib/createOrderFromTemplate');

exports.patch = require('./lib/patch');
exports.formatOrderForProfile = require('./lib/formatOrderForProfile');
