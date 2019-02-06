const express = require('express');
const app = express();
const port = 9000;
const services = JSON.parse(process.env.services);
const servicePort = process.env.servicePort;

let counter = 0;

const request = require('request');

app.use(express.urlencoded({extended: true}));

const getService = function() {
    let numberOfServices = services.length;
    let service = services[counter % numberOfServices];
    counter++;
    return service;
};

app.get('*', (req, res) => {
    let service = getService();
    const url = `http://${service}:${servicePort}${req.url}`;
    request.get(url, (err, options, data) => {
        res.send(data);
    });
});

app.post('*', (req, res) => {
    let service = getService();
    let url = `http://${service}:${servicePort}${req.url}`;
    request.post(url, {form: req.body}, (err, options, data) => {
        res.send(data);
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));