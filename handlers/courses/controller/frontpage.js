var Course = require('../models/course');

exports.get = function*() {

  this.locals.courses = yield Course.find({}).sort({weight: 1}).exec();

  this.body = this.render('frontpage');
};
