const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')
const Field = require('../models/field');
const{isLoggedIn, validateField, isAuthor} = require('../middleware');
const fields = require('../controllers/field');
const multer = require('multer');
const{storage} = require("../cloudinary");
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(fields.index))
    .post(isLoggedIn, upload.array('image'), validateField,  catchAsync(fields.createField));

router.get('/new', isLoggedIn, fields.renderNewForm);

router.route('/:id')
    .get(catchAsync(fields.showField))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateField, catchAsync(fields.updateField))
    .delete(isLoggedIn, isAuthor, catchAsync(fields.deleteField));


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(fields.renderEditForm));

module.exports = router;