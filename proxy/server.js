const express = require('express');
const app = express();
const port = 9000;
const services = new Set([]);
const servicePort = process.env.servicePort;

let counter = 0;

const request = require('request');

app.use(express.urlencoded({extended: true}));

const getService = function() {
    let spinningServices = [...services];
    let numberOfServices = spinningServices.length;
    let service = spinningServices[counter % numberOfServices];
    counter++;
    return service;
};

const discoverService = function (req) {
    let serviceName = req.body.serviceName;
    services.add(serviceName);
};

const getUrl = function(serviceName, port, url){
    return `http://${serviceName}:${port}${url}`;
};

const handleGetRequest = (req, res) => {
    let service = getService();
    const url = getUrl(service, servicePort, req.url);
    request.get(url, (err, options, data) => {
        res.send(data);
    });
};

app.get('*', (req, res) => {
    handleGetRequest(req, res);
});

app.post('*', (req, res) => {
    if(req.url === "/discover"){
        discoverService(req);
        res.send("OK");
        return;
    }
    let service = getService();
    let url = `http://${service}:${servicePort}${req.url}`;
    request.post(url, {form: req.body}, (err, options, data) => {
        res.send(data);
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));