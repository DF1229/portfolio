// This file facilitates a connection to a MongoDB database, based on a URI in the environment variables

const mongoose = require("mongoose");
const { MONGO_URI, MONGO_DB, MONGO_USER, MONGO_PASSWORD } = process.env;

exports.connect = () => {
    const conn_string = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_URI}/${MONGO_DB}?authSource=admin&authMechanism=SCRAM-SHA-256`;
    const log_string = `mongodb://${MONGO_USER}:*****************@${MONGO_URI}/${MONGO_DB}?authSource=admin&authMechanism=SCRAM-SHA-256`
    mongoose.connect(conn_string)
    .then(() => {
        console.log(`Connected to database on ${log_string}`);
    }).catch((err) => {
        console.log(`Failed to connect to database on ${log_string}`);
        console.error(err);
        process.exit(1);
    });
}
