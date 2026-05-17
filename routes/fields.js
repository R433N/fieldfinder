const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')
const Field = require('../models/field');
const{isLoggedIn, validateField, isAuthor} = require('../middleware');




router.get('/', catchAsync(async (req, res) => {
    const fields = await Field.find({});
    res.render('fields/index', { fields });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('fields/new');
})

router.post('/', isLoggedIn, validateField, catchAsync(async (req, res) => {
    const field = new Field(req.body.field);
    field.author = req.user._id;
    await field.save();
    req.flash('success', 'Successfully made a new field!');
    res.redirect(`/fields/${field._id}`);
}))

router.get('/:id', catchAsync(async (req, res) => {
    const field = await Field.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author',
            model: 'User'
        }
    }).populate('author');
    if(!field){
        req.flash('error', 'Cannot find that field');
        return res.redirect('/fields');
    }
    res.render('fields/show', { field });
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} = req.params;
    const field = await Field.findById(id);
    if(!field){
        req.flash('error', 'Cannot find that field');
        return res.redirect('/fields');
    }
    res.render('fields/edit', {field});
}))

router.put('/:id', isLoggedIn, isAuthor, validateField, catchAsync(async (req, res) => {
    const {id} = req.params;
    const f = await Field.findByIdAndUpdate(id, { ...req.body.field });
    req.flash('success', 'Successfully updated field!');
    res.redirect(`/fields/${f._id}`);
}))

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(async (req,res) => {
    const {id} = req.params;
    const field = await Field.findById(id)
    if(!field.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to edit this field')
        return res.redirect(`/fields/${id}`);
    }
    await Field.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted field!');
    res.redirect('/fields');
}))

module.exports = router;