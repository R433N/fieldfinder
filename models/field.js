const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fieldSchema = new Schema({
    title: { type: String },
    cityLocation: { type: String },
    fieldType: { type: String }

})

module.exports = mongoose.model('field', fieldSchema);