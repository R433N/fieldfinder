const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fieldSchema = new Schema({
    title:  String ,
    location:  String ,
    fieldType:  String

})

module.exports = mongoose.model('Field', fieldSchema);