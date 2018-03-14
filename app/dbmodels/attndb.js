var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var attendSchema = new Schema({
	attendreason: String,
	//username: [{ type: Schema.Types.name, ref: 'user' }]
    //u_id: [{ type: Schema.Types.ObjectId, ref: 'user' }]
   	event: String,
    //event_id: [{ type: Schema.Types.ObjectId, ref: 'event' }]

});

module.exports = mongoose.model("attending", attendSchema);

