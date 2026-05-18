const Field = require('../models/field');
const Review = require('../models/review.js')

module.exports.createReview = async (req, res) => {
    const field = await Field.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    field.reviews.push(review);
    await review.save();
    await field.save();
    req.flash('success', 'Successfully added review!');
    res.redirect(`/fields/${field._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id , reviewId } = req.params
    await Field.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/fields/${id}`)
};
