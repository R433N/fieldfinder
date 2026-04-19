const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fieldSchema = new Schema({
    title:  String ,
    image: String,
    location:  String ,
    fieldType:  String,
    phone: { type: String, default: 'Unavailable' }

})

module.exports = mongoose.model('field', fieldSchema);