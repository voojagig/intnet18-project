var mongoose = require('mongoose');




//DEFINE model 
var Schema = mongoose.Schema;

var eventSchema = new Schema({
	name: String,
    start_date: Date,
    end_date: Date,
    event_text: String,
    u_id: Number,
    category_ids: [{ type: Schema.Types.ObjectId, ref: 'category' }]


});

//"COMPILE" model
module.exports = mongoose.model("event", eventSchema);
//If model already exist, empty it
// security.remove({}, function(err) { 
//    console.log('collection removed') 
// });

//Create model instance
// eventdb.create({ name: 'Höganäs Loppis', start_date: "2018-04-01T12:00:00", end_date: "2018-04-01T16:00:00", event_text: "hej kom å handla", u_id: 32, category_name: "Möbler"}, function (err, awesome_instance) {
//   if (err) return handleError(err);
//   // saved!
// });
// eventdb.create({ name: 'Sony', id: 2 }, function (err, awesome_instance) {
//   if (err) return handleError(err);
//   // saved!
// });
