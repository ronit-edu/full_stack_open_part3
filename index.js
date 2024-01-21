const express = require("express");
const morgan = require('morgan');
const cors = require("cors")
const app = express();

app.use(cors())
app.use(express.json());

morgan.token('req_body', (req, res) => JSON.stringify(req.body));
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

app.get("/info", (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
                    <p>${Date()}</p>`);
})


app.get("/api/persons", (request, response) => {
    response.json(persons);
})

app.post("/api/persons", (request, response) => {
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
    person.id = Math.floor(Math.random()*10000);
    persons = persons.concat(person);
    response.json(person);
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    person = persons.find(person => person.id === id);
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(p => p.id === id);
    if (person) {
        persons = persons.filter(person => person.id !== id);
        response.json(person);
    }
    response.status(404).end();
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})