const express = require('express');
const mongoose = require('mongoose');
const router = express.Router({mergeParams: true});
const {validateReview} = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')

const Review = require('../models/review');  
const Field = require('../models/field');

router.post('/', validateReview, catchAsync(async (req, res) => {
    const field = await Field.findById(req.params.id);
    const review = new Review(req.body.review);
   
    field.reviews.push(review);
    await review.save();
    await field.save();
    req.flash('success', 'Successfully added review!');
    res.redirect(`/fields/${field._id}`);
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id , reviewId } = req.params
    await Field.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/fields/${id}`)
}))

module.exports = router;