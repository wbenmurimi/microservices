var mongoose = require('mongoose');

var OrderSchema = new mongoose.Schema({
  
  product:{
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'Product'
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


var Order = mongoose.model('Order', OrderSchema);

module.exports = Order;