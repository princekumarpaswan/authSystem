const mongoose = require("mongoose");

const MONGODB_URL = "someString"

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
