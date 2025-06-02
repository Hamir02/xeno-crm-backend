const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  totalSpend: Number,
  visits: Number,
  lastPurchaseDate: Date,
});

module.exports = mongoose.model('Customer', customerSchema);
