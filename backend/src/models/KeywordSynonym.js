const mongoose = require('mongoose');

const keywordSynonymSchema = new mongoose.Schema(
  {
    keyword: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Keyword',
      required: [true, 'Keyword reference is required'],
      unique: true,
      index: true,
    },
    synonyms: {
      type: [String],
      default: [],
      index: true, // index the elements in the array
    },
  },
  {
    timestamps: true,
  }
);

const KeywordSynonym = mongoose.model('KeywordSynonym', keywordSynonymSchema);
module.exports = KeywordSynonym;
