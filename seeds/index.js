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
            fieldType: 'Artificial Grass',
            phone: '123-456-7890',
            images: [
                {
                url: 'https://res.cloudinary.com/doaxyxcdv/image/upload/v1779348535/FieldFinder/mnah9puer0ezrnomgwxz.png',
                filename: 'FieldFinder/mnah9puer0ezrnomgwxz',
                },
                {
                url: 'https://res.cloudinary.com/doaxyxcdv/image/upload/v1779348535/FieldFinder/himey4ywkyqnks3rnilh.jpg',
                filename: 'FieldFinder/himey4ywkyqnks3rnilh',
                }
            ]
        })
        await test.save();
    }
}
seedDB();