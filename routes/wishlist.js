const express = require("express");
const router = express.Router();
const DB = require("../config/database");
const Wishlist = DB.Wishlist;

// //add item to wishlist api route
// router.post('/api/add', function(req, res){
//     req.checkBody("userid", "userid is required");
//     let errors = req.validationErrors();

//     if(errors){
//         res.json({status: false, message: errors});
//     } else {
//         const wishlist = new Wishlist(req.body);
//         wishlist.save().then((wishlist) => res.status(200).json({status: true, wishlist: wishlist }))
//     }
// });

//add item to wishlist api route
router.post('/api/add', function (req, res) {
    if( req.body.productid === req.body.productmeta){
        Wishlist.find({ "userid": req.body.userid, "comboid": req.body.productid }).then((data) => check(data));
        function check(data){
            if(data.length > 0){
                res.json({ status: false, error: "This Product Already Exists" });    
            } else {
                const wishlist = new Wishlist({
                    combo: true,
                    comboid: req.body.productid,
                    userid: req.body.userid
                }); 
                wishlist.save().then((wishlist) => res.status(200).json({ status: true, wishlist: wishlist }))
            }
        }
    } else {


    req.checkBody("userid", "userid is required");
    let errors = req.validationErrors();
    Wishlist.find({ "userid": req.body.userid, "productid": req.body.productid }).then((data) => check(data));
    function check(data) {
        if (data.length > 0) {
            res.json({ status: false, error: "This Product Already Exists" });
        } else {
            if (errors) {
                res.json({ status: false, message: errors });
            } else {
                const wishlist = new Wishlist(req.body);
                wishlist.save().then((wishlist) => res.status(200).json({ status: true, wishlist: wishlist }))
            }
        }
    }
}});


//delete item from wishlist api route 
router.post('/api/delete', function(req, res){
    req.checkBody('id', 'is is required');
    let errors = req.validationErrors();

    if(errors){
        res.json({status: false, message: errors});
    } else {
        let query = req.body.id;
        Wishlist.findOneAndRemove({_id: query}).then(() => res.status(200).json({success: true, message:"Succesfully removed"})).catch((err) => res.status(400).json({success: false, error: err}));
    }
});


// get al the wishlist items for any particular user
router.post('/api/byuser', function(req, res){
    
    // req.checkbody("userid", "Userid is required");

    // let errors = req.validationErrors();

    // if(errors){
    //     res.json({status: false, messages: errors});
    // } else {

    let user = req.body.userid;
    // Wishlist.find({userid: user}).then((wishlist) => res.status(200).json({success: true, wishlist: wishlist})).catch((err) => res.status(400).json({success: false, error: err}))
    Wishlist.find({userid: user, combo: false}).populate("productid").populate("productmeta").then((wishlist) => display(wishlist));
    function display(data){
        Wishlist.find({userid: user, combo: true}).populate("comboid").then((data1) => res.status(200).json({success: true, wishlist: data, combo: data1})).catch((err) => res.status(400).json({success: false, error: err}))
    }
});

//DONT FORGET TOA DD ENSURE AUTHENTICATEED IN ALL FUNCTIONS
//get all the wishlist items to show in backend
router.get('/all', async function(req, res){
  let wishlist = await Wishlist.find({combo: false}).populate('productid').populate('userid').populate('productmeta').select('-1').sort({_id: 'asc'});
  let combos = await Wishlist.find({combo: true}).populate('comboid').populate('userid');
  let final = wishlist.concat(combos);
  console.log({combos})
  console.log({"Final list": final})
  return res.status(200).render('wishlist_all.hbs', {
        pageTitle: 'Wishlist of Users',
        products: final

    });
});

//edit any particular wishlist item from backend
router.get('/edit/:id', async function(req, res){
    let query = req.params.id;
    let wishlist = await Wishlist.findById(query);

    return res.status(200).render('wishlist_edit.hbs', {
        pageTitle: 'Edit Wishlist',
        wishlist: wishlist
    });
});

//Post edit route for cditing any particular wishlist
router.post('/edit/:id', async function(req, res){
    let query = req.params.id;
    
    let newWishlist = {};
    console.log(req.body);
    newWishlist.serial=req.body.serial;
    newWishlist.userid=req.body.userid;
    newWishlist.productid=req.body.productid;
    newWishlist.productmeta=req.body.productmeta;
    Wishlist.findOneAndUpdate({_id: query}, newWishlist).then(() => res.redirect("/wishlist/all")).catch((err) => console.log(err));

});

//delete any particluar wishlist item from backend
router.get('/delete/:id', async function(req, res){
    let query = req.params.id;

    Wishlist.findOneAndRemove(query, function(err, product){
          if(err){
            console.log(err);
          }
              res.redirect('/wishlist/all');
        });
    });


module.exports = router;