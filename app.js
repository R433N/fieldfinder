const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
const Field = require('./models/field');

mongoose.connect('mongodb://localhost:27017/fieldfinder')

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Database Connected Successfully")
})

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
    res.render('home');
})

app.get('/fields', async (req, res) => {
    const fields = await Field.find({})
    res.render('fields/index', {fields})
})

app.get('/fields/:id', async (req, res) => {
    const field = await Field.findById(req.params.id);
    res.render('fields/show', {field});
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});