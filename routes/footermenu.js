const express       = require('express');
const router        = express.Router();
const db            = require('../config/database');
const Footer          = db.Footer;
const Page          = db.Page;
const Category = db.Category;
let pagetype12 = ["home", "faq", "contact", "about", "layout1", "privacy policy", "terms & conditions", "website accessbility", "learn", "shipping & returns", "Benefits of CBD", "comingsoon", "consult"];


//Route to add footer menu
router.post('/add', async function(req, res){
    req.checkBody('footerlabel', 'footer Label is required').notEmpty();
    req.checkBody('parentid',  'Please Select Parent Menu is required').notEmpty();
    
    function maxorder(array) {
        return array.reduce((a, b) => Math.max(a, b));
    }
    let parentId = req.body.parentid,
    allFooters = await Footer.find({parentid: parentId}).select('-1').sort({_id: 'asc'});
    console.log(allFooters);
    if(allFooters.length == 0){
        assignedOrder = 1;
        console.log("here");
    } else {
        console.log("there");
        let footerOrders = allFooters.map(function(el){
            return el.footerorder
        });
        console.log({test:footerOrders});

    //Function to find the missing numer in sequential order
    var missingOrder = footerOrders.reduce(function(acc, cur, ind, arr) {
    var diff = cur - arr[ind-1];
    if (diff > 1) {
      var i = 1;
      while (i < diff) {
        acc.push(arr[ind-1]+i);
        i++;
      }
    }
    return acc;
    }, []);

    if(missingOrder.length == 0){
        let maxOrder = Number;
        maxOrder = maxorder(footerOrders);
        assignedOrder = ++maxOrder;
    } else {
       assignedOrder = missingOrder[0];
    }
      
    }
    
    let errors = req.validationErrors();
    if (errors) {
        return res.status(200).json({ 'success': false, 'message': 'Validation error', errors: errors });
    }

    var key = "parentid"; 
    if(req.body.parentid == "") {
        delete req.body[key];
    }

    let bs                  = req.body.pagetitle.split('|!@');
    let footer                = new Footer();
    footer.pagetype           = req.body.pagetype;
    footer.category           = req.body.category;
    footer.externallink       = req.body.externallink;
    footer.footerlabel        = req.body.footerlabel;
    footer.pagetitle          = bs[1];
    footer.pageid             = bs[0];
    footer.parentid           = req.body.parentid; 
    footer.footerorder          = assignedOrder;
    await footer.save().then((footer) => res.redirect("/footermenus/all")).catch((err) => res.status(200).json({ 'success': false, 'message': 'Validation error', 'errors': err }));
});

//old menu edit code 
// router.get("/edit/:id", function(req, res){
//     query = req.params.id;
//     console.log(req.body);
//     Footer.findById(query).then((data) => display(data));
    
//     function display(data1){

//         Footer.find({}, function (err, menus) {
//             if (err) return res.status(404).render('all_footermenus.hbs', {
//                 pageTitle: 'All Menus',
//                 error:err,
//                 message:'Error In fatching Footer Menus'
//                 });
//             if(menus) {
//                 let filteredmenus = menus.filter(function(el){
//                     return !el.parentid});
//                 Page.find({}, function(err, data){
                    
//                 Category.find({}, function(err, category){
//                     res.render('edit_menus.hbs', {
//                         pageTitle: 'Edit Menu',
//                         menus: data1,
//                         menus1: data,
//                         category: category,
//                         filter: filteredmenus,
//                         countries: countries,
//                         allmenus: menus,
//                         pagetype: pagetype12
//                     })
//                     })});
//                 }})
//             }});


//Post edit form for menus
router.post("/edit/:id", async function(req, res){
    console.log(req.body);
    let query = req.params.id;
    let footeredit;
    if(req.body.footeredit){
        footeredit = "yes";
    } else {
        footeredit = "no";
    }
    Footer.findOne({_id: query}).then((data) => customcheck(data));
    async function customcheck(keytest){
        let bs;
        if(req.body.pagetype == 'custompage' && footeredit == "no"){
            console.log("here");
            bs = req.body.pagetitle.split('|!@');
        }
        let td = req.body.footerlabel; 
        await Footer.findOne({td}).then((data) => check(data));
        async function check(data){
            let footermenu = {};
            if(req.body.footerlabel){
                if(data == null){
                    footermenu.footerlabel= req.body.footerlabel
                }
            }
        
            if(req.body.pagetype == 'custompage' && footeredit == "no"){
                console.log("inside second loop ")
                if(req.body.pagetitle){
                    footermenu.pagetitle= bs[1]}
                    if(req.body.pageid){
                        footermenu.pageid= bs[0]
                    }
                  
            } 
            if(req.body.pagetype){
                footermenu.pagetype= req.body.pagetype
            }
            if(req.body.footerid){
                footermenu.footerid= req.body.menuid
            }
            if(req.body.category){
                footermenu.category= req.body.category
            }
            if(req.body.menuorder){
                footermenu.footerorder= req.body.menuorder
            }
            if(req.body.parentid){
                footermenu.parentid= req.body.parentid
            }
            if(req.body.type){
                footermenu.type = req.body.type
            }
if(req.body.externallink){
                footermenu.externallink  = req.body.externallink;
            }
            console.log({footermenu})
            await Footer.findOneAndUpdate({_id: query}, footermenu, {new: true}).then((data) => {
                return res.json({'success': true, 'message': "Footer Menu Saved Successfully"});

            });
        }
    }
});

router.get("/getall", async function(req, res){
    Footer.find({}).populate('parentid').sort({footerorder: 'asc'}).then((data) => sort(data));
    function sort(data){
        if(data.length > 1){
            console.log({getall: data})
            res.setHeader('Cache-Control', 'Vary: Accept-Encoding Header, max-age=31557600');
        res.json({status: true, footer: data});}
        else {
            res.json({status: false, error:"Footer menu not found"});
        };
    }
});

router.get("/delete/:id", async function(req, res){
 let id = req.params.id;
    Footer.findOneAndRemove({_id: id}).then((data) => {
        res.redirect('/footers/all');
    });
});
 
router.get('/all', async function (req, res) {
    let myfooter  = await Footer.find({parentid: { $exists: false }}).select('-1').sort({_id: 'asc'});
    let newfooters = []
    let childMenus  = await Footer.find({parentid: { $exists: true }}).select('-1').sort({footerorder: 'asc'});
    var result = myfooter.map(function(el) {
        let footerID = el._id;
        const mychild = childMenus.map((childitem, index)=> {
            if(childitem.parentid.toString() == footerID.toString()){
                return childitem
            }
        }).filter(el => el);
        newfooters = [
            ...newfooters,
            {
                label: el.footerlabel,
                type: el.pagetype,
                footerorder: el.footerorder,
                category: el.category,
                pagetitle: el.pagetitle,
                pageid: el.pageid,
                id: el._id,
                child: mychild
            }
        ]
        return mychild
    }).filter(el => el);  
    Footer.find({}, function (err, footer) {
        if (err) return res.status(404).render('all_footer.hbs', {
            pageTitle: 'All Footer Menus',
            error:err,
            message:'Error In fetching Footer Menus'
            });
        if(footer) {
            
            let filteredmenus = footer.filter(function(el){
                return !el.parentid
            });
            Page.find({}, function(err, data){
                Category.find({}, function(err, category){
            res.render('all_footermenu.hbs', {
                pageTitle: 'All Footer Menus',
                footer: footer,
                filter: filteredmenus,
                pages: data,
                newfooters: newfooters,
                categories: category,
                pagetype: pagetype12
            })
            })});
        }
    }).populate('parentid').sort({menuid: 'asc'});
});

router.post("/change-order", async function(req, res){
    let menus = req.body.menuarray;
    let order = req.body.orderarray;
    let errorArray = [];
    console.log(menus);
    menus.map((menuid, index)=> {
        let query = menuid;
        let menu = {};
        menu.footerorder = order[index];
        Footer.findByIdAndUpdate(query, menu, {new: true}).then((data) => console.log({data})).catch((err) => errorArray.push(err));
    });
    if(errorArray.length == 0) {
        return res.status(200).json({ 'success': true, 'message': "Footer Order Saved Successfully", "body":req.body }); 
    } else {
        return res.status(200).json({ 'success': false, 'message': "Error in Saving Footer Order", 'errors': errorArray});
    }
      
});

function ensureAuthenticated(req, res, next) {
    if (req.user) {
        return next();
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect('/users/login');
    }
}

module.exports = router;