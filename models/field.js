const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const fieldSchema = new Schema({
    title:  String ,
    image: String,
    location:  String ,
    fieldType:  String,
    phone: { type: String },
    reviews : [{
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }]

});

fieldSchema.post('findOneAndDelete', async function(doc){
    if (doc) {
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
    }
})


module.exports = mongoose.model('field', fieldSchema);