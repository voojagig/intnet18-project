var mongoose = require('mongoose');



var Schema = mongoose.Schema;

var categorySchema = new Schema({
	category_name: String,
    example_goods: [String]

});

module.exports = mongoose.model("category", categorySchema);

