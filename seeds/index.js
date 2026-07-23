if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const cities = require('./cities');
const Field = require('../models/field');
const { fieldNames } = require('./seedHelpers');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

mongoose.connect('mongodb://localhost:27017/fieldfinder');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected Successfully');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Field.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const random50 = Math.floor(Math.random() * cities.length);
        const location = `${cities[random50].name}, ${cities[random50].province}`;
        const geoData = await geocoder.forwardGeocode({
            query: location,
            limit: 1
        }).send();

        const test = new Field({
            author: '6a03c0e0c601c25fdaf607c2',
            location,
            title: `${sample(fieldNames)}`,
            fieldType: 'Artificial Grass',
            phone: '123-456-7890',
            geometry: geoData.body.features[0].geometry,
            images: [
                {
                    url: 'https://res.cloudinary.com/doaxyxcdv/image/upload/v1779350067/FieldFinder/svubtbdkhxhjsac3dfnu.jpg',
                    filename: 'FieldFinder/svubtbdkhxhjsac3dfnu',
                },
                {
                    url: 'https://res.cloudinary.com/doaxyxcdv/image/upload/v1779229101/main-sample.png',
                    filename: 'FieldFinder/main-sample',
                }
            ]
        });
        await test.save();
        console.log(`Seeded: ${test.title} at ${location}`);
    }
};

seedDB().then(() => {
    console.log('Done seeding!');
    mongoose.connection.close();
});
