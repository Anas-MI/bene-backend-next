const express = require('express');
const router = express.Router();
const path = require("path");
const db = require('../config/database');
const ShipEngine = require('shipengine'); 
var engine = new ShipEngine.ShipEngine('PM6NH9XxC4cfprAHDnkkFoPVjZTyWjkqVZS1JxcpzTQ');

/*
Route to get the shipping rates
*/
router.get('/shippingrates', async (req, res) => {
let ship_from = new ShipEngine.Address('Shippy', 'Austin', 'TX', '78756', 'US', 
    '3800 N. Lamar Blvd.', 'Suite 220', '512-485-4282', 'ShipStation', 'no'); 
 
let ship_to = new ShipEngine.Address('Micky and Minnie Mouse', 'Burbank', 'CA', 
    '91521', 'US', '500 South Buena Vista Street', 'bourbon street', '714-781-4565');
 
// reserved word
var parcel = new ShipEngine.Package({
    value: 9.0, 
    unit: "ounce"
}, {
    "unit": "inch", 
    "length": 8.0, 
    "width" : 8.0, 
    "height": 8.0
});
 
var shipment = new ShipEngine.Shipment({
    ship_to,
    ship_from,
    packages: [parcel]
});

shipment.validate_address = "no_validation"; 
 
// First get carriers to work with, then pass them through the promise chain
engine.getCarriers().then((data) => {
    return data.carriers.map((val) => {
        console.log({"carrierid" : val.carrier_id})
        return val.carrier_id
    }); 
})
.then((data)=>{
    console.log({"getrates": data})
    return engine.getRates(shipment, {
        
        carrier_ids: data
    });
})
.then((data)=>{
    data.rate_response.rates.forEach((rate)=>{
        console.log(rate); 
    }); 
})
.catch((err) => {
    console.log('error', err); 
});
})

/* 
List your available carriers
*/
router.get("/carriers", (req, res) => {
    engine.getCarriers().then((data) => {
        console.log(data); 
    }).catch((err) => {
        console.log('error', err); 
    });
});

/*
Track your package
*/
router.get("/track", (req, res) => {
engine.trackPackage('ups', '9405511899223197428490').then((data)=>{
    console.log(data); 
}).catch((err) => {
    console.log('error', err); 
});
})

/*
Create a shipment
*/
router.get("/create", (req, res) => {
    var ship_from = new ShipEngine.Address('Shippy', 'Austin', 'TX', '78756', 'US', 
    '3800 N. Lamar Blvd.', 'Suite 220', '512-485-4282', 'ShipStation', 'no'); 
 
var ship_to = new ShipEngine.Address('Micky and Minnie Mouse', 'Burbank', 'CA', 
    '91521', 'US', '500 South Buena Vista Street', 'bourbon street','714-781-4565');
 
var parcel = new ShipEngine.Package({
    value: 8.0, 
    unit: "ounce"
}, {
    "unit": "inch", 
    "length": 8.0, 
    "width" : 8.0, 
    "height": 8.0
});
 
var shipment = new ShipEngine.Shipment({
    ship_to: ship_to, 
    ship_from: ship_from,
    packages: [parcel], 
    validate_address: "no_validation",
    confirmation: "none", 
    insurance_provider: "none"
    //advanced_options: {}
});
 

engine.createShipment(shipment).then((data) => {
    console.log(data); 
}).catch((err)=> {  
    console.log('error', err); 
});
})

/*
Create Labels
*/
router.get("/label", (req, res) => {
    var ship_from = new ShipEngine.Address('Shippy', 'Austin', 'TX', '78756', 'US', 
    '3800 N. Lamar Blvd.', 'Suite 220', '512-485-4282', 'ShipStation', 'no'); 
 
var ship_to = new ShipEngine.Address('Micky and Minnie Mouse', 'Burbank', 'CA', 
    '91521', 'US', '500 South Buena Vista Street', 'bourbon street', '714-781-4565');
 
var parcel = new ShipEngine.Package({
    test_label: true,
    value: 1.0, 
    unit: "ounce"
}, {
    "unit": "inch", 
    "length": 5.0, 
    "width" : 5.0, 
    "height": 5.0   
});
 
var shipment = new ShipEngine.Shipment({
    ship_to: ship_to, 
    ship_from: ship_from,
    packages: [parcel], 
    validate_address: "no_validation",
    confirmation: "none",
    "test_label": true
});
 
shipment.service_code = "usps_priority_mail";
 
engine.createLabel(shipment, "pdf").then((data) => {
    console.log(data);
}).catch((err)=> {
    console.log(err);
});
})
module.exports = router;