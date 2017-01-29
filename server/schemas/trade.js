const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tradeSchema = new Schema({
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book'
  },
  accepted: Boolean
});

module.exports = mongoose.model('Trade', tradeSchema);
