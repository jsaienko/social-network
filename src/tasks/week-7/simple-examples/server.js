const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const PORT = 5000;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const loggerMiddleware = (req, res, next) => {
    console.log(req.originalUrl);
    next();
}

const errorHandler = (req, res, next) => {
    res.sendHTTPError = (status, message) => {
        res.status(status).json({ message })
    }
    next()
}

app.use(loggerMiddleware)
app.use(errorHandler)

app.get('/', (req, res) => {
    res.send("Hello World!")
})

app.get('/echo', (req, res) => {
    console.log(req.query)
    const query = req.query;
    res.send(query);
})

app.get('/users', (req, res) => {
    const users = JSON.parse(fs.readFileSync('./users.json'));
    res.json(users);
})

app.post('/users', (req, res) => {
    const users = JSON.parse(fs.readFileSync('./users.json'));
    const newUser = req.body;
    users.push(newUser);
    fs.writeFileSync('./users.json', JSON.stringify(users), 'utf-8')
    res.send({ message: 'User has been added' })
})

app.use((req, res) => {
    res.status(404).send({ message: 'Requested api not found' })
})

app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message })
})

app.listen(PORT, function(err) {
    if (err) {
        console.log(err)
    }
    console.log(`Server is running on ${PORT} port`)
})

