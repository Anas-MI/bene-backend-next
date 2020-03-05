const express       = require('express');
const app               = express();
const router        = express.Router();
const db            = require('../config/database');
const Barcodes          = db.barcodes;

 
router.get("/all", async function(req, res){
    let barcode = await Barcodes.find({});
    res.render('all_barcode.hbs', {
        barcode
    })
});

router.get("/add", async function(req, res){
    res.render('add_barcode.hbs')
});

router.get("/edit/:id", async function(req, res){
    let id = req.params.id;
    Barcodes.findById(id).then((data) => show(data)).catch((err) => res.json({status: false, error: err}));
    function show(data){
        res.render('edit_barcodes.hbs', {
            barcodes: data
        })
    }
});

//Post edit form for menus
router.post("/edit/:id", async function(req, res){
    let id = req.params.id;
    Barcodes.findById(id).then((data) => show(data)).catch((err) => res.json({status: false, error: err}));
    async function show(data){
    let isvendorid = await Barcodes.find(
        {$or: [
            { barcode: req.body.barcode },
            { formula: req.body.formula },
            { filename: req.body.filename }
          ]})
    console.log(isvendorid.length);
    if(isvendorid.length == 0){
         await Barcodes.findByIdAndUpdate(id, req.body, {new: true} ).then((data) =>  res.redirect("/barcodes/all")).catch((err) => res.json({status: false, error: err}));
    } else if(req.body.filename == data.filename){
        await Barcodes.findByIdAndUpdate(id, req.body, {new:true}).then((data) => res.redirect("/barcodes/all")).catch((err) => res.json({status: false, error: err}));
    }else {
        res.render('edit_barcodes.hbs', {error:'Field already exists'})
    }}})

//Delete route to delete vendors
router.get("/delete/:id", async function(req, res){
   let id = req.params.id;
   Barcodes.findByIdAndRemove(id).then(() => res.redirect("/barcodes/all")).catch((err) => res.status({error: err})) 
});



//Post edit form for menus
router.post("/add", async function(req, res){
   
    let isvendorid = await Barcodes.find(
        {$or: [
            { barcode: req.body.barcode },
            { formula: req.body.formula },
            { filename: req.body.filename }
          ]})
    console.log(isvendorid.length);
    if(isvendorid.length == 0){
        let barcode = new Barcodes(req.body)    
        barcode.save().then((data) => res.redirect("/barcodes/all")).catch((err) => res.json({status: false, error: err}));
        } else {
            res.render('add_barcode.hbs', {error: 'Field already exists'});
        }
    })

    module.exports = router;
    