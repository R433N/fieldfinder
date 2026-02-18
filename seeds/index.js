const mongoose = require('mongoose');
const cities = require('./cities')
const field = require('../models/field')
const {fieldNames} = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/fieldfinder')

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Database Connected Successfully")
})

const sample = (array) => array[Math.floor(Math.random() * array.length)];


const seedDB = async() => {
    await field.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const random50 = Math.floor(Math.random() * cities.length);
        const test = new field({
            location: `${cities[random50].name}, ${cities[random50].province}`,
            title: `${sample(fieldNames)}`
        })
        await test.save();
    }
}

seedDB();