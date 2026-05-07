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

const fields = require('./routes/fields');
const reviews = require('./routes/reviews');

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




app.use('/fields', fields);
app.use('/fields/:id/reviews', reviews);

app.get('/', (req, res) => {
    res.render('home');
})





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