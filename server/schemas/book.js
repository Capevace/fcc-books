const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title: String,
  isbn: String
});

module.exports = mongoose.model('Book', bookSchema);
