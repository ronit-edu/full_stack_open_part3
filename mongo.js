const mongoose = require("mongoose");

const password = process.argv[2];
const url = `mongodb+srv://ronit-edu:${password}@phonebook.cfefunc.mongodb.net/phonebook?retryWrites=true&w=majority`;
mongoose.set("strictQuery", false);
mongoose.connect(url);

const person_schema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model("Person", person_schema);

if (process.argv.length >= 4) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })
    person.save().then(result => {
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`);
        mongoose.connection.close()
    })
} else if (process.argv.length >= 3) {
    Person.find({}).then(result => {
        console.log("phonebook:");
        result.forEach(person => {
            console.log(person.name, person.number);
        })
        mongoose.connection.close();
    })
} else {
    console.log("invalid input");
    mongoose.connection.close();
}