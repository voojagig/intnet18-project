var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
	event_name: String,
    message: String,
    username: String,
    timestamp: { type: Date, default: Date.now },

    //todo: uncomment nedan för att göra foreign key
    //event_name:[
      //{type: Schema.Types.ObjectId, ref: 'event'}
    //]
});

module.exports = mongoose.model('post', PostSchema);