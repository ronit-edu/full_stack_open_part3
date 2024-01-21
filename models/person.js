require("dotenv").config()
const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
console.log(url);
mongoose.connect(url);

const person_schema = new mongoose.Schema({
    name: String,
    number: String,
});

person_schema.set("toJSON", {
    transform: (document, returned_object) => {
        returned_object.id = returned_object._id.toString();
        delete returned_object._id;
        delete returned_object.__v;
    }
});

module.exports = mongoose.model("Person", person_schema);