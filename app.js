const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const path = require('path')
const methodOverride = require('method-override')
const Field = require('./models/field');

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

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/fields', async (req, res) => {
    const fields = await Field.find({})
    res.render('fields/index', {fields})
})

app.get('/fields/new', (req, res) => {
    res.render('fields/new');
})

app.post('/fields', async (req, res) => {
    const field = new Field(req.body.field);
    await field.save();
    res.redirect(`/fields/${field._id}`);
})

app.get('/fields/:id', async (req, res) => {
    const field = await Field.findById(req.params.id);
    res.render('fields/show', {field});
})

app.get('/fields/:id/edit', async (req, res) => {
    const field = await Field.findById(req.params.id);
    res.render('fields/edit', {field});
})

app.put('/fields/:id', async (req, res) => {
    const {id} = req.params;
    const field = await Field.findByIdAndUpdate(id, { ...req.body.field });
    res.redirect(`/fields/${field._id}`);
})

app.delete("/fields/:id", async (req,res) => {
    const{id} = req.params;
    await Field.findByIdAndDelete(id);
    res.redirect('/fields');
})








app.listen(3000, () => {
  console.log('Server is running on port 3000');
});