const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	body: { type: String, required: true },
	commentDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', CommentSchema);
