const Quiz = require('../models/quiz');
const QuizResult = require('../models/quizResult');
const _ = require('lodash');

exports.post = function*() {

  var quiz = yield Quiz.findOne({
    slug: this.params.slug,
    archived: false
  }).exec();

  if (!quiz) {
    this.throw(404);
  }

  if (!this.session.quizzes) {
    this.session.quizzes = {};
  }

  var sessionQuiz = {
    started: Date.now(),
    id: quiz._id,
    questionsTakenIds: [],
    answers: []
  };

  this.session.quizzes[quiz.slug] = sessionQuiz;

  sessionQuiz.questionCurrentId = _.sample(quiz.questions, 1)[0]._id;

  this.redirect(quiz.getUrl());
};
