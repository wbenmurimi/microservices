const mongoose = require('mongoose');

const ProductSchema  = new mongoose.Schema({
    name:{
        type:String,
        trim: true
    },
    cost:{
        type: String,
        trim: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product