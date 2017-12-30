var mongoose = require('mongoose');

// Defines new schema.
var typeSchema = new mongoose.Schema({
    user: { type: String},
    time: Number,
    numErrors: Number,
    dateTyped: { type: Date, default: Date.now },
    accuracy: Number,
    wpm: Number,
    typedText: String,
    // This should reference the user in case future features need to query for this.
    userid: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

// Creates model from the new schema.
var Round = mongoose.model('Round', typeSchema);

// Exports model.
module.exports = Round;
