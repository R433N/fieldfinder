const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { fieldSchema, reviewSchema} = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError')
const path = require('path')
const methodOverride = require('method-override')
const Field = require('./models/field');
const { off } = require('process');
const field = require('./models/field');
const Review = require('./models/review');  
const { constants } = require('os');

mongoose.connect('mongodb://localhost:27017/fieldfinder')

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Database Connected Successfully")
})

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

const validateField = (req, res, next) => {
       //if(!req.body.field) throw new ExpressError('Invalid Field Data', 400)

   const { error } = fieldSchema.validate(req.body);
   if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
   }
   else{
        next();
   }
}

const validateReview = (req, res, next) => {

    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else{
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/fields', catchAsync(async (req, res) => {
    const fields = await Field.find({});
    res.render('fields/index', { fields });
}));

app.get('/fields/new', (req, res) => {
    res.render('fields/new');
})

app.post('/fields', validateField, catchAsync(async (req, res) => {

    const field = new Field(req.body.field);
    await field.save();
    res.redirect(`/fields/${field._id}`);
}))

app.get('/fields/:id', catchAsync(async (req, res) => {
     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new ExpressError('Invalid Field ID', 400);
  }
    const field = await Field.findById(req.params.id).populate('reviews');
    console.log(field);
    res.render('fields/show', {field});
}))

app.get('/fields/:id/edit', catchAsync(async (req, res) => {
    const field = await Field.findById(req.params.id);
    res.render('fields/edit', {field});
}))

app.put('/fields/:id', validateField, catchAsync(async (req, res) => {
    const {id} = req.params;
    const field = await Field.findByIdAndUpdate(id, { ...req.body.field });
    res.redirect(`/fields/${field._id}`);
}))

app.delete("/fields/:id", catchAsync(async (req,res) => {
    const{id} = req.params;
    await Field.findByIdAndDelete(id);
    res.redirect('/fields');
}))

app.post('/fields/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const field = await Field.findById(req.params.id);
    const review = new Review(req.body.review);
   
    field.reviews.push(review);
    await review.save();
    await field.save();
    res.redirect(`/fields/${field._id}`);
}))

app.delete('/fields/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id , reviewId } = req.params
    await Field.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/fields/${id}`)
}))

app.all('/{*path}', (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong"} = err
    if(!err.message) err.message = "Oh No, Something Went Wrong!"
    res.status(statusCode).render('error', {err})
})






app.listen(3000, () => {
  console.log('Server is running on port 3000');
});