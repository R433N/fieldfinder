const mongoose = require('mongoose');
const cities = require('./cities')
const Field = require('../models/field')
const {fieldNames} = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/fieldfinder')

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Database Connected Successfully")
})

const sample = (array) => array[Math.floor(Math.random() * array.length)];


const seedDB = async() => {
    await Field.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const random50 = Math.floor(Math.random() * cities.length);
        const test = new Field({
            author: '6a03c0e0c601c25fdaf607c2',
            location: `${cities[random50].name}, ${cities[random50].province}`,
            title: `${sample(fieldNames)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            fieldType: 'Artificial Grass',
            phone: '123-456-7890'
        })
        await test.save();
    }
}
seedDB();