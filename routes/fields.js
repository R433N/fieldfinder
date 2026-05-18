const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')
const Field = require('../models/field');
const{isLoggedIn, validateField, isAuthor} = require('../middleware');
const fields = require('../controllers/field');



router.get('/', catchAsync(fields.index));

router.get('/new', isLoggedIn, fields.renderNewForm);

router.post('/', isLoggedIn, validateField, catchAsync(fields.createField));

router.get('/:id', catchAsync(fields.showField));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(fields.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, validateField, catchAsync(fields.updateField))

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(fields.deleteField))

module.exports = router;