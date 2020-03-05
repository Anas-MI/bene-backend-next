const express       = require('express');
const app               = express();
const router        = express.Router();
const db            = require('../config/database');
const Vendor          = db.vendor;

 
router.get("/all", async function(req, res){
    let vendor = await Vendor.find({});
    res.render('vendor_all.hbs', {
        vendor
    })
});

router.get("/add", async function(req, res){
    res.render('add_vendor.hbs')
});

router.get("/edit/:id", async function(req, res){
    let id = req.params.id;
    Vendor.findById(id).then((data) => show(data)).catch((err) => res.json({status: false, error: err}));
    function show(data){
        res.render('edit_vendor.hbs', {
            vendor: data
        })
    }
});

//Post edit form for menus
router.post("/edit/:id", async function(req, res){
    let id = req.params.id;
    Vendor.findById(id).then((data) => show(data)).catch((err) => res.json({status: false, error: err}));
    async function show(data){
    let isvendorid = await Vendor.find({vendorid: req.body.vendorid})
    console.log(isvendorid.length);
    if(isvendorid.length == 0){
        let isvendorname = await Vendor.find({vendorname: req.body.vendorname})
        if(isvendorname.length == 0){
            await Vendor.findByIdAndUpdate(id, req.body, {new: true} ).then((data) =>  res.redirect("/vendor/all")).catch((err) => res.json({status: false, error: err}));
        }  else {
            res.render('edit_vendor.hbs', {error: 'Vendor Name already exists'});
        }
    } else if(req.body.vendorid == data.vendorid){
        await Vendor.findByIdAndUpdate(id, req.body, {new:true}).then((data) => res.redirect("/vendor/all")).catch((err) => res.json({status: false, error: err}));
    }else {
        res.render('edit_vendor.hbs', {error:'Vendor ID already exists'})
    }}})

//Delete route to delete vendors
router.get("/delete/:id", async function(req, res){
   let id = req.params.id;
   Vendor.findByIdAndRemove(id).then(() => res.redirect("/vendor/all")).catch((err) => res.status({error: err})) 
});



//Post edit form for menus
router.post("/add", async function(req, res){
   
    let isvendorid = await Vendor.find({vendorid: req.body.vendorid})
    console.log(isvendorid.length);
    if(isvendorid.length == 0){
        let isvendorname = await Vendor.find({vendorname: req.body.vendorname})
        console.log(isvendorname.length);
        if(isvendorname.length == 0){
            let vendor = new Vendor(req.body);
            vendor.save().then((data) => res.redirect("/vendor/all")).catch((err) => res.json({status: false, error: err}));
        } else {
            res.render('add_vendor.hbs', {error: 'Vendor Name already exists'});
        }
    } else {
        res.render('add_vendor.hbs', {error:'Vendor ID already exists'})
    }})

    module.exports = router;
    