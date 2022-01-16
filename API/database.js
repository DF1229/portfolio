// This file facilitates a connection to a MongoDB database, based on a URI in the envirement variables
// This file gets called by public.js.

const mongoose = require("mongoose");
const { MONGO_URI } = process.env;

exports.connect = () => {
    mongoose.connect(MONGO_URI)
    .then(() => {
        console.log(`Connected to database on ${MONGO_URI}`);
    }).catch((err) => {
        console.log(`Failed to connect to database on ${MONGO_URI}`);
        console.error(err);
        process.exit(1);
    });
}