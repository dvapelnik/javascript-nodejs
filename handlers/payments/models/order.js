var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var OrderTemplate = require('./orderTemplate');
var _ = require('lodash');

var schema = new Schema({
  amount:      {
    type:     Number,
    required: true
  },
  module:      { // module so that transaction handler knows where to go back e.g. 'getpdf'
    type:     String,
    required: true
  },
  title:       {
    type:     String,
    required: true
  },
  description: {
    type: String
  },
  status:      {
    type: String
  },

  // order can be bound to either an email or a user
  email:       {
    type: String
  },
  user:        {
    type: Schema.Types.ObjectId,
    ref:  'User'
  },

  data:        Schema.Types.Mixed,
  created:     {
    type:    Date,
    default: Date.now
  }
});

schema.statics.createFromTemplate = function(orderTemplate, body) {
  var Order = this;

  var data = _.assign({
    title:       orderTemplate.title,
    description: orderTemplate.description,
    amount:      orderTemplate.amount,
    data: {}
  },  body || {});

  return new Order(data);

};

schema.plugin(autoIncrement.plugin, {model: 'Order', field: 'number', startAt: 1});

module.exports = mongoose.model('Order', schema);
