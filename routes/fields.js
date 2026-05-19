const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')
const Field = require('../models/field');
const{isLoggedIn, validateField, isAuthor} = require('../middleware');
const fields = require('../controllers/field');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.route('/')
    .get(catchAsync(fields.index))
    //.post(isLoggedIn, validateField, catchAsync(fields.createField));
    .post(upload.array('image'), (req, res) => {
        res.send({ 
            body: req.body, 
            files: req.files 
        });
    })
router.get('/new', isLoggedIn, fields.renderNewForm);

router.route('/:id')
    .get(catchAsync(fields.showField))
    .put(isLoggedIn, isAuthor, validateField, catchAsync(fields.updateField))
    .delete(isLoggedIn, isAuthor, catchAsync(fields.deleteField));


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(fields.renderEditForm));

module.exports = router;