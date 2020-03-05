const express = require('express');
const router = express.Router();
const EasyPost = require('@easypost/api');
//const apiKey = "EZTKabecb64c21dd48da9c2049dbce486899dlgd5K9QwNRQq4xhv01gJQ"

//Test key for mkothary@gmail.com
const apiKey = "EZTK09944b7a65df4e44a6d8457478b41575Hq5800KjUUXBh0L8zNhKow"

//Production Key 
//const apiKey = "EZAKabecb64c21dd48da9c2049dbce486899y32tOxabXd1V7aP7cunOSQ"

const api = new EasyPost(apiKey);

// Set Address
const toAddress = new api.Address({
    name: 'Dr. Steve Brule',
    street1: '179 N Harbor Dr',
    city: 'Redondo Beach',
    state: 'CA',
    zip: '90277',
    country: 'US',
    phone: '310-808-5243'
});

const fromAddress = new api.Address({
    name: 'EasyPost',
    street1: '118 2nd Street',
    street2: '4th Floor',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    phone: '415-123-4567'
});

fromAddress.save().then(addr => {
    console.log(addr.id);
});

//Create a shipment
router.post("/shipment", (req, res) => {
    let name= req.body.name,
    street1= req.body.street,
    city= req.body.street,
    state= req.body.state,
    zip= req.body.zip,
    country= req.body.country,
    phone= req.body.phone;

    //Creation of from address
    // const fromaddress = new api.Address({
    //     name: 'EasyPost',
    //     street1: '118 2nd Street',
    //     street2: '4th Floor',
    //     city: 'San Francisco',
    //     state: 'CA',
    //     zip: '94105',
    //     phone: '415-123-4567'
    // });

// Set Address
const toaddress = new api.Address({
    name,
    street1,
    city,
    state,
    zip,
    country,
    phone
});

    let length = req.body.length,
    width = req.body.width,
    height = req.body.height,
    weight = req.body.weight


    //creation of parcel
    const parcel = new api.Parcel({
        length,
        width,
        height,
        weight
    })

    //creation of shipment 
    const shipment = new api.Shipment({
        to_address: toaddress,
        from_address: fromAddress,
        parcel: parcel
    })

    shipment.save().then((ship) => res.json({status: true, data: ship})).catch((error) => res.json({status: false, error}));
    //ship.buy(ship.lowestRate(), 2.70).then(console.log);
    //})

});

//confirm the shipment 
router.post("/confirm", (req, res) => {
    const shipmentId = req.body.shipmentid;
    const rate = req.body.rate;
    api.Shipment.retrieve(shipmentId).then(ship =>
        //=> console.log(ship)).catch((err) => console.log({err}))
        //ship.buy(ship.lowestRate()).then(s => res.json({status: true, data:s})).catch((error) => res.json({status: false, error})))
        ship.buy(rate).then(s => res.json({status: true, data:s})).catch((error) => res.json({status: false, error})))

        //})
})

//Get the list of all the shipments
router.get("/getall", (req, res) => {
    api.Shipment.all({
        page_size: 2,
        start_datetime: '2016-01-02T08:50:00Z'
    }).then(console.log);
})

//refund a shipment
router.post("/refund", (req, res) => {
    let shipmentid = req.body.shipmentid;
    api.Shipment.retrieve(shipmentid).then(s => {
        s.refund().then((s) => res.json({status: true, data: s})).catch((error) => {res.json({status: false, error})});
      });      
})
/*
Tracking codes
EZ1000000001	pre_transit
EZ2000000002	in_transit
EZ3000000003	out_for_delivery
EZ4000000004	delivered
EZ5000000005	return_to_sender
EZ6000000006	failure
EZ7000000007	unknown
*/

//Create a tracker
// router.post("/track", (req, res) => {
//     let tracking_code = req.body.trackingcode;
//     const tracker = new api.Tracker({
//         tracking_code,
//         carrier: 'USPS',
//       });      
//       tracker.save().then(s => {res.json({status: true, data: s})}).catch((error) => {status: false, error});
      
// });

//Retreive a list of all the trackers
router.get("/track/listall", (req, res) => {    
api.Tracker.all({
   page_size: 2,
   start_datetime: '2016-01-02T08:50:00Z'
  }).then(s => res.json({status: true, data: s })).catch((error) => res.json((error) => res.json({status:false,error})));
})

//Retrieve a tracker
router.post("/track/", (req, res) => {
    let trackerid = req.body.trackerid;
api.Tracker.retrieve(trackerid).then(s => res.json({status: true, data: s})).catch((error) => res.json({status: false, error}));    
})

//Retrive the names pf all the carriers
router.get("/getcarriers" , (req, res) => {  api.CarrierType.all().then((s) => res.json({status: true, data: s})).catch((error) => res.json({status: false, error}));
});



module.exports = router;