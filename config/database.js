const mongoose = require("mongoose");
require("dotenv").config



mongoose.set('strictQuery', false);

const MONGODB_URL = process.env.MONGODB_URL

exports.connect = () => {
    mongoose.connect(MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(console.log("connection sucess"))
        .catch((error) => {
            console.log("connetion failed" + error);
            process.exit(1)
        })
}
