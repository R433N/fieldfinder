const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const fieldSchema = new Schema({
    title:  String ,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    location:  String ,
    fieldType:  String,
    phone: { type: String },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
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