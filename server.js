const { Client } = require('pg');
const connectionString = process.env.DATABASE_URL;
const client = new Client(connectionString);

client.connect();

const express = require('express');
const request = require('request');
const app = express();
const port = 8080;

const showNumbers = function (res) {
    client.query("select * from numbers").then(queryRes => {
        let strings = queryRes.rows.map(valueObj => `<li>${valueObj.value}</li>`);
        res.send(strings.length ? `<ul>${strings.join('<br>')}</ul>` : "No entries found");
    }).catch(() => {
        res.send("No entries found");
    });
};

app.use(express.urlencoded({extended: true}));

app.get('/number', (req, res) => {
    showNumbers(res);
});

app.get('/', (req, res) => {
    res.send(
        `<form method="post" action="/number"><input type="number" name="number" 
          placeholder="Enter the number" required/> <input type="submit"/> </form>`
    );
});

app.post('/number', (req, res) => {
    client.query(`CREATE TABLE IF NOT EXISTS numbers (value varchar (1000))`);
    client.query(`INSERT INTO numbers values(${req.body.number})`);
    showNumbers(res);
});


app.listen(port, () => {
    request.post("http://proxy:9000/discover", {form: {serviceName: process.env.service_name}}, (err, options, data) => {

    });
    console.log(`Listening on port ${port}`);
});