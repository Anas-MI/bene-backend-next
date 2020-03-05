const express       = require('express');
const router        = express.Router();
const db            = require('../config/database');
const Menu          = db.Menu;
const Page          = db.Page;
const Combos = db.combos;
const Category = db.Category;
const productMeta = db.ProductMeta;
let pagetype12 = ["home", "faq", "contact", "about", "layout1", "privacy policy", "terms & conditions", "website accessbility", "learn", "shipping & returns", "Benefits of CBD", "comingsoon", "consult"];
let countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua ; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas"
	,"Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia ; Herzegovina","Botswana","Brazil","British Virgin Islands"
	,"Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica"
	,"Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea"
	,"Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana"
	,"Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India"
	,"Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia"
	,"Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania"
	,"Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia"
	,"New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal"
	,"Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles"
	,"Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts ; Nevis","St Lucia","St Vincent","St. Lucia","Sudan"
	,"Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad; Tobago","Tunisia"
	,"Turkey","Turkmenistan","Turks ; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","United States Minor Outlying Islands","Uruguay"
	,"Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];


//Post route to search menus according to the page title
// router.post('/search', function(req, res))
//send all the categories wih their particular products for the menu 
router.get('/', async (req, res) => {
    let category = await Category.find();
    let products1 = {}
    let final = category.map( async categ => {
        let name = categ.categorytitle;
        let products = await productMeta.find({categoryid: categ._id}).populate("productid")
        let arrayofprod = products.map(product => { 
           return  product.productid.producttitle
        })
         products1[name] = arrayofprod
    })
    let combos = await Combos.find();
    let combolist = combos.map(el => {
        return el.title
    })
    setTimeout(function(){  
       let finalProd = {...products1, combos: combolist}
        console.log({finalProd})
      ; }, 1500);
});

router.post('/add', async function(req, res){
    req.checkBody('menulabel', 'Menu Label is required').notEmpty();
    req.checkBody('parentid',  'Please Select Parent Menu is required').notEmpty();
    
    function maxorder(array) {
        return array.reduce((a, b) => Math.max(a, b));
    }
    let parentId = req.body.parentid,
    allMenus = await Menu.find({parentid: parentId}).select('-1').sort({_id: 'asc'});
    if(allMenus.length == 0){
        assignedOrder = 1;
    } else {
        let menuOrders = allMenus.map(function(el){
            return el.menuorder
        });
        var missingOrder = menuOrders.reduce(function(acc, cur, ind, arr) {
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
            maxOrder = maxorder(menuOrders);
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
    let menu                = new Menu();
    menu.pagetype           = req.body.pagetype;
    menu.category           = req.body.category;
    menu.externallink       = req.body.externallink;
    // menu.type = req.body.type
    menu.menulabel          = req.body.menulabel;
    menu.pagetitle          = bs[1];
    menu.pageid             = bs[0];
    menu.parentid           = req.body.parentid; 
    menu.menuorder          = assignedOrder;
    menu.blockedcountries   = req.body.blockedcountries; 
    await menu.save().then((menus) => res.redirect("/menus/all")).catch((err) => res.status(200).json({ 'success': false, 'message': 'Validation error', 'errors': err }));
});

router.get("/edit/:id", function(req, res){
    query = req.params.id;
    Menu.findById(query).then((data) => display(data));

    function display(data1){
        Menu.find({}, function (err, menus) {
            if (err) return res.status(404).render('all_menus.hbs', {
                pageTitle: 'All Menus',
                error:err,
                message:'Error In fatching Menus'
            });
            if(menus) {
                let filteredmenus = menus.filter(function(el){
                    return !el.parentid
                });
                Page.find({}, function(err, data){
                    Category.find({}, function(err, category){
                        res.render('edit_menus.hbs', {
                            pageTitle: 'Edit Menu',
                            menus: data1,
                            menus1: data,
                            category: category,
                            filter: filteredmenus,
                            countries: countries,
                            allmenus: menus,
                            pagetype: pagetype12
                        })
                    });
                });
            }
        })
    }
});

//Post edit form for menus
router.post("/edit/:id", async function(req, res){
    console.log(req.body);
    let query = req.params.id;
    let menuedit;
    if(req.body.menuedit){
        menuedit = "yes";
    } else {
        menuedit = "no";
    }
    Menu.findOne({_id: query}).then((data) => customcheck(data));
    async function customcheck(keytest){
        let bs;
        if(keytest.pagetype == 'custompage' && menuedit == "no"){
            bs = req.body.pagetitle.split('|!@');
        }
        let td = req.body.menulabel; 
        await Menu.findOne({td}).then((data) => check(data));
        async function check(data){
            let menu = {};
            if(req.body.menulabel){
                if(data == null){
                    menu.menulabel= req.body.menulabel
                }
            }
        
            if(keytest.pagetype == 'custompage' && menuedit == "no"){
                if(req.body.pagetitle){
                    menu.pagetitle= bs[1]}
                    if(req.body.pageid){
                        menu.pageid= bs[0]
                    }
            }

            if(req.body.pagetype){
                menu.pagetype= req.body.pagetype
            }
            if(req.body.menuid){
                menu.menuid= req.body.menuid
            }
            if(req.body.category){
                menu.category= req.body.category
            }
            if(req.body.menuorder){
                menu.menuorder= req.body.menuorder
            }
            if(req.body.parentid){
                menu.parentid= req.body.parentid
            }
            if(req.body.type){
                menu.type = req.body.type
            }

            if(req.body.externallink){
                menu.externallink  = req.body.externallink;
            }
            console.log({menudata: menu})
            await Menu.findOneAndUpdate({_id: query}, menu, {new: true}).then((data) => {
                return res.json({'success': true, 'message': "Menu Saved Successfully"});
            });
        }
    }
});

router.get("/getall", async function(req, res){
    Menu.find({}).populate('parentid').sort({menuorder: 'asc'}).then((data) => sort(data));
    function sort(data){
        if(data.length > 1){
            res.setHeader('Cache-Control', 'Vary: Accept-Encoding Header, max-age=31557600');
        res.json({status: true, menus: data});}
        else {
            res.json({status: false, error:"Menus not found"});
        };
    }
});

router.get("/delete/:id", async function(req, res){
 let id = req.params.id;
    Menu.findOneAndRemove({_id: id}).then((data) => {
        res.redirect('/menus/all');
    });
});
 
router.get('/all', ensureAuthenticated, async function (req, res) {
    let mymenus  = await Menu.find({parentid: { $exists: false }}).select('-1').sort({_id: 'asc'});
    let newmenus = []
    let childMenus  = await Menu.find({parentid: { $exists: true }}).select('-1').sort({menuorder: 'asc'});
    var result = mymenus.map(function(el) {
        let menuID = el._id;
        const mychild = childMenus.map((childitem, index)=> {
            if(childitem.parentid.toString() == menuID.toString()){
                return childitem
            }
        }).filter(el => el);
        newmenus = [
            ...newmenus,
            {
                label: el.menulabel,
                type: el.pagetype,
                menuorder: el.menuorder,
                category: el.category,
                pagetitle: el.pagetitle,
                pageid: el.pageid,
                menuid: el.menuid,
                id: el._id,
                child: mychild
            }
        ]
        return mychild
    }).filter(el => el);
    // console.log({result : JSON.stringify(newmenus)});   
    Menu.find({}, function (err, menus) {
        if (err) return res.status(404).render('all_menus.hbs', {
            pageTitle: 'All Menus',
            error:err,
            message:'Error In fatching Menus'
            });
        if(menus) {
            
            let filteredmenus = menus.filter(function(el){
                return !el.parentid
            });
            Page.find({}, function(err, data){
                Category.find({}, function(err, category){
            res.render('all_menus.hbs', {
                pageTitle: 'All Menus',
                menus: menus,
                filter: filteredmenus,
                countries: countries,
                pages: data,
                newmenus: newmenus,
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
    menus.map((menuid, index)=> {
        let query = menuid;
        let menu = {};
        menu.menuorder= order[index];
        Menu.findOneAndUpdate({_id: query}, menu, {new: true}).then((data) => console.log(data)).catch((err) => errorArray.push(err));
    });
    if(errorArray.length == 0) {
        return res.status(200).json({ 'success': true, 'message': "Menu Order Saved Successfully" }); 
    } else {
        return res.status(200).json({ 'success': false, 'message': "Error in Saving Menu Order", 'errors': errorArray});
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