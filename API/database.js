// This file facilitates a connection to a MongoDB database, based on a URI in the envirement variables
// This file gets called by public.js.

const mongoose = require("mongoose");
const { MONGO_URI, MONGO_DB } = process.env;

exports.connect = () => {
    const conn_string = `mongodb://${MONGO_URI}/${MONGO_DB}`;
    mongoose.connect(conn_string)
    .then(() => {
        console.log(`Connected to database on ${conn_string}`);
    }).catch((err) => {
        console.log(`Failed to connect to database on ${conn_string}`);
        console.error(err);
        process.exit(1);
    });
}
