const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function() { 
    return this.url.replace('/upload', '/upload/w_200');
})
const fieldSchema = new Schema({
    title:  String ,
    images: [ImageSchema],
    location: String,
    geometry: {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
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