const express = require("express");
const morgan = require('morgan');
const cors = require("cors");
const Person = require("./models/person");
const app = express();

app.use(cors());
app.use(express.static("dist"))
app.use(express.json());

morgan.token('req_body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req_body'));

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get("/info", (request, response, next) => {
    Person.find({}).then(persons => {
        response.send(`<p>Phonebook has info for ${persons.length} people</p>
                    <p>${Date()}</p>`);
    })
    .catch(error => next(error))
    
})


app.get("/api/persons", (request, response, next) => {
    Person.find({}).then(persons => {
        response.json(persons);
    })
    .catch(error => next(error));
})

app.post("/api/persons", (request, response, next) => {
    const person = request.body;
    if (!Object.hasOwn(person, "name") || !person.name) {
        return response.status(400).json({
            error: "name missing"
        });
    } if (!Object.hasOwn(person, "number") || !person.number) {
        return response.status(400).json({
            error: "number missing"
        });
    } if (persons.find(p => p.name === person.name)) {
        return response.status(400).json({
            error: "name must be unique"
        });
    }
    const new_person = new Person({
        name: person.name,
        number: person.number
    });
    new_person.save().then(() => {
        response.json(new_person);
    })
    .catch(error => next(error));
    
})

app.get("/api/persons/:id", (request, response, next) => {
    Person.findById(request.params.id)
    .then(result => {
        if (result) {
            response.json(result);
        } else {
            response.status(404).end();
        }
    })
    .catch(error => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
    const person = {
        name: request.body.name,
        number: request.body.number,
    }
    Person.findByIdAndUpdate(request.params.id, person, {new: true, runValidators: true, context: 'query'})
    .then(result => {
        response.json(result);
    })
    .catch(error => next(error));
})

app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
        if (result) {
            response.json(result);
        } else {
            response.status(404).end();
        }
    })
    .catch(error => next(error));
})

const error_handler = (error, request, response, next) => {
    console.log(error.message);
    if (error.name === "CastError") {
        return response.status(400).send({error: "malformatted id"})
    } else if (error.name === "ValidationError") {
        return response.status(400).json({error: error.message})
    }

    next(error);
}

app.use(error_handler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})