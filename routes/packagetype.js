const express       = require('express');
const app               = express();
const router        = express.Router();
const db            = require('../config/database');
const Packagetype          = db.packagetype;

 
router.get("/all", async function(req, res){
    let packagetype = await Packagetype.find({});
    res.render('packagetypeall.hbs', {
        packagetype
    })
});

router.get("/add", async function(req, res){
    res.render('add_Packagetype.hbs')
});

router.get("/edit/:id", async function(req, res){
    let id = req.params.id;
    Packagetype.findById(id).then((data) => show(data)).catch((err) => res.json({status: false, error: err}));
    function show(data){
        console.log(data)
        res.render('edit_Packagetype.hbs', {
            ptype: data
        })
    }
});


//Post edit form for menus
router.post("/edit/:id", async function(req, res){
    let id = req.params.id;
    Packagetype.findById(id).then((data) => show(data)).catch((err) => res.json({status: false, error: err}));
 async function show(data){
    req.checkBody('packingid', 'Packing ID is required').notEmpty();
    req.checkBody('packingtype', 'Packing Type is required').notEmpty();
    req.checkBody('description', 'Description is required').notEmpty();
    let errors = req.validationErrors();
    if(errors){
        console.log(errors);
        res.render('edit_Packagetype.hbs',  {error: errors, ptype: data});
    } else {
    console.log({data: data.packingid});
    console.log({body: req.body})
    let isPackagetypeid = await Packagetype.find({packingid: req.body.packingid})
    if(isPackagetypeid.length == 0){
            Packagetype.findByIdAndUpdate(id, req.body, {new:true}).then((data) => res.redirect("/packagetype/all")).catch((err) => res.json({status: false, error: err}));
        
    } else if(req.body.packingid == data.packingid){
        Packagetype.findByIdAndUpdate(id, req.body, {new:true}).then((data) => res.redirect("/packagetype/all")).catch((err) => res.json({status: false, error: err}));
    } else {
        res.render('edit_Packagetype.hbs', {error:
            [{ param: 'error',
            msg: 'Package Id already exists',
            value: '' } ]})
    }}}})


//Post edit form for menus
router.post("/add", async function(req, res){
   
    req.checkBody('packingid', 'Packing ID is required').notEmpty();
    req.checkBody('packingtype', 'Packing Type is required').notEmpty();
    req.checkBody('description', 'Description is required').notEmpty();
    let errors = req.validationErrors();
    if(errors){
        console.log(errors);
        res.render('add_Packagetype.hbs', {error: errors });
    } else {

    let isPackagetypeid = await Packagetype.find({packingid: req.body.packingid})
    console.log(isPackagetypeid);
    if(isPackagetypeid.length == 0){
            let packagetype = new Packagetype(req.body);
            packagetype.save().then((data) => res.redirect("/packagetype/all")).catch((err) => res.json({status: false, error: err}));
        
    } else {
        res.render('add_Packagetype.hbs', {error:
            [{ param: 'error',
            msg: 'Package Id already exists',
            value: '' } ]})
    }}})


//Delete route to delete vendors
router.get("/delete/:id", async function(req, res){
    let id = req.params.id;
    Packagetype.findByIdAndRemove(id).then(() => res.redirect("/packagetype/all")).catch((err) => res.status({error: err})) 
 });
 


    module.exports = router;
    