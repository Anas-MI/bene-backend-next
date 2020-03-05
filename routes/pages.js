// Old code starts
// const express           = require('express');
// const router            = express.Router();
// const cors              = require('cors');
// const path              = require('path');
// var aws                 = require('aws-sdk');
// var bodyParser          = require('body-parser');
// var multer              = require('multer');
// var multerS3            = require('multer-s3');
// const bcrypt            = require('bcryptjs');
// const db                = require('../config/database');
// const User              = db.User;
// const UserMeta          = db.UserMeta;
// const Page              = db.Page;
// const Menu              = db.Menu;
// const OrderProduct      = db.orderProduct;
// const Notify            = db.Notify;
// const app               = express();
// const s3                = new aws.S3();

// let pagetype        = ["home", "faq", "contact", "about", "layout1", "privacy policy", "terms and conditions", "website accessbility", "learn", "shipping & returns", "Benefits of CBD", "comingsoon", "consult"];

// aws.config.update({
//     secretAccessKey: process.env.SECRETACCESSKEY,
//     accessKeyId: process.env.ACCESSKEYID,
//     region: process.env.REGION
// });

// app.use(bodyParser.json());

// const upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: process.env.BUCKET,
//         metadata: function (req, file, cb) {
//         cb(null, {fieldName: file.fieldname});
//         },
//         key: function (req, file, cb) {
//             cb(null, Date.now() + '-prd-' + file.originalname);
//         }
//     }),
//     fileFilter: function (req, file, callback) {
//         var ext = path.extname(file.originalname);
//         if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
//             req.fileValidationError = "Forbidden extension";
//             return callback(null, false, req.fileValidationError);
//         }
//         callback(null, true)
//     },
//     limits:{
//         fileSize: 420 * 150 * 200
//     }
// });

// let countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua","Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas"
// 	,"Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia","Herzegovina","Botswana","Brazil","British Virgin Islands"
// 	,"Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica"
// 	,"Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea"
// 	,"Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana"
// 	,"Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India"
// 	,"Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia"
// 	,"Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania"
// 	,"Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia"
// 	,"New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal"
// 	,"Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre","Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles"
// 	,"Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts","Nevis","St Lucia","St Vincent","St. Lucia","Sudan"
// 	,"Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad ; Tobago","Tunisia"
// 	,"Turkey","Turkmenistan","Turks","Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","United States Minor Outlying Islands","Uruguay"
// 	,"Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

// router.get("/orders/alerts/:id", ensureAuthenticated, async function(req, res){
//     Notify.findOneAndUpdate({_id: req.params.id}, {$set: {
//         "readflag" : true
//     }}).then(() => res.redirect("/pages/orders/allalerts"));
// });

// //Displaying all Notifications
// router.get("/orders/allalerts", ensureAuthenticated, async function(req, res){
//     Notify.find({"readflag" : false}).then((data) => show(data));
//     function show(data){
//         res.status(200).render('alerts.hbs', {
//             pageTitle: 'All Alerts',
//             alerts: data
//         });
//     } 
// });


// //Route to process any particular Order
// router.get("/orders/process/:id", ensureAuthenticated, async function(req, res){
//     res.status(200).render('process.hbs', {
//         pageTitle: 'Process Order'
//     });   
// });

// // //Route to delet any particular order
// // router.get("/orders/delete/:id", function(req, res){
// //     let query = req.params.id;
    
// //     OrderProduct.findById(query, function(err, product){
// //         OrderProduct.remove({query}, function(err){
// //           if(err){
// //             console.log(err);
// //           } else {
// //               res.redirect('/pages/orders/all');}
// //         });
// //     });
// // });




// //add page v2 logic 
// router.get('/layout/add', function (req, res) {
//     let layoutDropDown  = {};
//     layoutDropDown.layout1 = "Layout One Template";
//     layoutDropDown.home = "Layout Two Template";
//     layoutDropDown.layout2 = "Layout Three Template";
//     layoutDropDown.html = "Default Layout";
//     res.render('addpagev2.hbs', {
//         pageTitle: 'Add Layout',
//         section: 'page',
//         layoutDropDown: layoutDropDown,
//         countries: countries,
//         pagetype: pagetype,
//         action: 'add'
//     });
// });

// router.get('/layout/html', async function(req, res){
//     res.render('add-html.hbs', {
//         pageTitle: 'Add html'
//     });
// });

// // router.post('/add', upload.any(), async function(req, res) {
// //     if(req.body.titlelayout1) {
// //         req.checkBody('titlelayout1', 'Page Title is required').notEmpty();
// //     } else {
// //         req.checkBody('title', 'Page Title is required').notEmpty();
// //     }
// //     let errors = req.validationErrors();
// //     let filesArray = req.files;
// //     if (errors) {
// //         if(req.files) {
// //             filesArray.map( (item, index)=> {
// //                 let insertfilename = item.location;
// //                 var params = {
// //                     Bucket: 'elasticbeanstalk-us-east-2-797993184252',
// //                     Key: insertfilename
// //                 };

// //                 s3.deleteObject(params, function (err, data) {
// //                     if (data) {
// //                         console.log("File deleted successfully");
// //                     }
// //                     else {
// //                         console.log("Check if you have sufficient permissions : "+err);
// //                     }
// //                 });
// //             });
// //         }
// //         return res.status(404).json({ 'success': false, 'message': 'validation error', "error": errors});
// //     }
// //     if(req.fileValidationError) return res.json({ 'success': false, 'message': 'File Validation error', errors: req.fileValidationError }); 
     
// //     let pageExist  = await Page.findOne({title: req.body.title}).select('-1').sort({_id: 'asc'});
// //     if(pageExist){
// //         res.json({ 'success': false, 'message': 'Page already exist with this Title', 'serialerror': 'Page already exist with this Title' });
// //     } else {
// //         if(req.body.titlelayout1){
// //             let optionsData = {};
// //             if(req.files) {
// //                 filesArray.map( async (item, index)=> {
// //                     let fieldname           = item.fieldname
// //                     optionsData[fieldname]  = item.location;
// //                 });
// //             }
// //             let page                = new Page();
// //             let trimmed             = req.body.titlelayout1;
// //             page.title              = trimmed.trim();
// //             page.layout             = 'layout1';
// //             page.common             = req.body.pagecommon;
// //             let items               = {};
// //             let continentData       = {};
// //             if(req.body.pagecommon == "no") {
// //                 let regions             = req.body.pageregion;
// //                 let usaCheck            = regions.includes("usa");
// //                 let europeCheck         = regions.includes("europe");
// //                 let australiaCheck      = regions.includes("australia");
// //                 if(usaCheck == true) {
// //                     let usathirdLink = req.body.usathirdimagelink;
// //                     if(usathirdLink) {
// //                         usathirdLink.map( async (item, linkindex)=> {
// //                             if(item == "") {
// //                                 let key = 'usathirdimage'+linkindex;
// //                                 filesArray.map( async (item, fileindex)=> {
// //                                     if(item.fieldname == key){
// //                                         usathirdLink[linkindex] = item.location; 
// //                                     }
// //                                 });  
// //                             }
// //                         });
// //                     }
                    

// //                     let usafourthLink = req.body.usafourthimagelink;
// //                     if(usafourthLink) {
// //                         usafourthLink.map( async (item, linkindex)=> {
// //                             if(item == "") {
// //                                 let key = 'usafourthimage'+linkindex;
// //                                 filesArray.map( async (item, fileindex)=> {
// //                                     if(item.fieldname == key){
// //                                         usafourthLink[linkindex] = item.location; 
// //                                     }
// //                                 });  
// //                             }
// //                         });
// //                     }
// //                     continentData['usa'] = {
// //                         "firstsection" : {
// //                             visibility: req.body.usafirstvisibility,
// //                             title: req.body.usafirsttitle,
// //                             author: req.body.usafirstauthor,
// //                             date: req.body.usafirstdate,
// //                             description: req.body.usafirstdescription,
// //                             firstorder: req.body.usafirstorder,
// //                             firstimage: optionsData.usafirstimage
// //                         },
// //                         "secondsection" : {
// //                             visibility: req.body.usasecondvisibility,
// //                             secondtitle: req.body.usasecondtitle,
// //                             seconddescription: req.body.usaseconddescription,
// //                             secondorder: req.body.usasecondorder,
// //                             secondtitle1: req.body.usasecondtitle1,
// //                             seconddescription1: req.body.usaseconddescription1,
// //                             secondorder1: req.body.usasecondorder1,
// //                             secondtitle2: req.body.usasecondtitle2,
// //                             seconddescription2: req.body.usaseconddescription2,
// //                             secondorder2: req.body.usasecondorder2,
// //                             secondtitle3: req.body.usasecondtitle3,
// //                             seconddescription3: req.body.usaseconddescription3,
// //                             secondorder3: req.body.usasecondorder3,
// //                             secondtitle4: req.body.usasecondtitle4,
// //                             seconddescription4: req.body.usaseconddescription4,
// //                             secondorder4: req.body.usasecondorder4
// //                         },
// //                         "thirdsection": {
// //                             visibility: req.body.usathirdvisibility,
// //                             thirdtitle: req.body.usathirdtitle,
// //                             thirddescription: req.body.usathirddescription,
// //                             thirdbtntext: req.body.usathirdbtntext,
// //                             thirdbtnlink: req.body.usathirdbtnlink,
// //                             thirdimage: usathirdLink,
// //                             thirdorder: req.body.usathirdorder,
// //                             thirdtitle1: req.body.usathirdtitle1,
// //                             thirddescription1: req.body.usathirddescription1,
// //                             thirdbtntext1: req.body.usathirdbtntext1,
// //                             thirdbtnlink1: req.body.usathirdbtnlink1,
// //                             thirdorder1: req.body.usathirdorder1,
// //                             thirdcopyimage_1: optionsData.usathirdcopyimage_1,
// //                             thirdtitle2: req.body.usathirdtitle2,
// //                             thirddescription2: req.body.usathirddescription2,
// //                             thirdbtntext2: req.body.usathirdbtntext2,
// //                             thirdbtnlink2: req.body.usathirdbtnlink2,
// //                             thirdcopyimage_2: optionsData.usathirdcopyimage_2,
// //                             thirdorder2:  req.body.usathirdorder2
// //                         },

// //                         "fourthsection" : {
// //                             visibility: req.body.usafourthvisibility,
// //                             fourthtitle: req.body.usafourthtitle,
// //                             fourthauthor: req.body.usafourthauthor,
// //                             fourthdescription: req.body.usafourthdescription,
// //                             fourthtwitter: req.body.usafourthtwitter,
// //                             fourthinsta: req.body.usafourthinsta,
// //                             fourthfb: req.body.usafourthfb,
// //                             fourthimage: usafourthLink,
// //                             fourthorder: req.body.usafourthorder,   
// //                         }
// //                     };
// //                 }
// //                 if(europeCheck == true) {
// //                     let europethirdLink = req.body.europethirdimagelink;
// //                     if(europethirdLink) {
// //                         europethirdLink.map( async (item, linkindex)=> {
// //                             if(item == "") {
// //                                 let key = 'europethirdimage'+linkindex;
// //                                 filesArray.map( async (item, fileindex)=> {
// //                                     if(item.fieldname == key){
// //                                         europethirdLink[linkindex] = item.location; 
// //                                     }
// //                                 });  
// //                             }
// //                         });
// //                     }
                    

// //                     let europefourthLink = req.body.europefourthimagelink;
// //                     if(europefourthLink) {
// //                         europefourthLink.map( async (item, linkindex)=> {
// //                             if(item == "") {
// //                                 let key = 'europefourthimage'+linkindex;
// //                                 filesArray.map( async (item, fileindex)=> {
// //                                     if(item.fieldname == key){
// //                                         europefourthLink[linkindex] = item.location; 
// //                                     }
// //                                 });  
// //                             }
// //                         });
// //                     }

// //                     continentData['europe'] = {
// //                         "firstsection" : {
// //                             visibility: req.body.europefirstvisibility,
// //                             title: req.body.europefirsttitle,
// //                             author: req.body.europefirstauthor,
// //                             date: req.body.europefirstdate,
// //                             description: req.body.europefirstdescription,
// //                             firstorder: req.body.europefirstorder,
// //                             firstimage: optionsData.europefirstimage
// //                         },
// //                         "secondsection" : {
// //                             visibility: req.body.europesecondvisibility,
// //                             secondtitle: req.body.europesecondtitle,
// //                             seconddescription: req.body.europeseconddescription,
// //                             secondorder: req.body.europesecondorder,
// //                             secondtitle1: req.body.europesecondtitle1,
// //                             seconddescription1: req.body.europeseconddescription1,
// //                             secondorder1: req.body.europesecondorder1,
// //                             secondtitle2: req.body.europesecondtitle2,
// //                             seconddescription2: req.body.europeseconddescription2,
// //                             secondorder2: req.body.europesecondorder2,
// //                             secondtitle3: req.body.europesecondtitle3,
// //                             seconddescription3: req.body.europeseconddescription3,
// //                             secondorder3: req.body.europesecondorder3,
// //                             secondtitle4: req.body.europesecondtitle4,
// //                             seconddescription4: req.body.europeseconddescription4,
// //                             secondorder4: req.body.europesecondorder4
// //                         },
// //                         "thirdsection": {
// //                             visibility: req.body.europethirdvisibility,
// //                             thirdtitle: req.body.europethirdtitle,
// //                             thirddescription: req.body.europethirddescription,
// //                             thirdbtntext: req.body.europethirdbtntext,
// //                             thirdbtnlink: req.body.europethirdbtnlink,
// //                             thirdimage: europethirdLink,
// //                             thirdorder: req.body.europethirdorder,
// //                             thirdtitle1: req.body.europethirdtitle1,
// //                             thirddescription1: req.body.europethirddescription1,
// //                             thirdbtntext1: req.body.europethirdbtntext1,
// //                             thirdbtnlink1: req.body.europethirdbtnlink1,
// //                             thirdorder1: req.body.europethirdorder1,
// //                             thirdcopyimage_1: optionsData.europethirdcopyimage_1,
// //                             thirdtitle2: req.body.europethirdtitle2,
// //                             thirddescription2: req.body.europethirddescription2,
// //                             thirdbtntext2: req.body.europethirdbtntext2,
// //                             thirdbtnlink2: req.body.europethirdbtnlink2,
// //                             thirdcopyimage_2: optionsData.europethirdcopyimage_2,
// //                             thirdorder2:  req.body.europethirdorder2
// //                         },

// //                         "fourthsection" : {
// //                             visibility: req.body.europefourthvisibility,
// //                             fourthtitle: req.body.europefourthtitle,
// //                             fourthauthor: req.body.europefourthauthor,
// //                             fourthdescription: req.body.europefourthdescription,
// //                             fourthtwitter: req.body.europefourthtwitter,
// //                             fourthinsta: req.body.europefourthinsta,
// //                             fourthfb: req.body.europeourthfb,
// //                             fourthimage: europefourthLink,
// //                             fourthorder: req.body.europefourthorder,   
// //                         }
// //                     };
// //                 }
// //                 if(australiaCheck == true) {
// //                     let australiathirdLink = req.body.australiathirdimagelink;
// //                     if(australiathirdLink) {
// //                         australiathirdLink.map( async (item, linkindex)=> {
// //                             if(item == "") {
// //                                 let key = 'australiathirdimage'+linkindex;
// //                                 filesArray.map( async (item, fileindex)=> {
// //                                     if(item.fieldname == key){
// //                                         australiathirdLink[linkindex] = item.location; 
// //                                     }
// //                                 });  
// //                             }
// //                         });
// //                     }
                    

// //                     let australiafourthLink = req.body.australiafourthimagelink;
// //                     if(australiafourthLink) {
// //                         australiafourthLink.map( async (item, linkindex)=> {
// //                             if(item == "") {
// //                                 let key = 'australiafourthimage'+linkindex;
// //                                 filesArray.map( async (item, fileindex)=> {
// //                                     if(item.fieldname == key){
// //                                         australiafourthLink[linkindex] = item.location; 
// //                                     }
// //                                 });  
// //                             }
// //                         });
// //                     }
// //                     continentData['australia'] = {
// //                         "firstsection" : {
// //                             visibility: req.body.australiafirstvisibility,
// //                             title: req.body.australiafirsttitle,
// //                             author: req.body.australiafirstauthor,
// //                             date: req.body.australiafirstdate,
// //                             description: req.body.australiafirstdescription,
// //                             firstorder: req.body.australiafirstorder,
// //                             firstimage: optionsData.australiafirstimage
// //                         },
// //                         "secondsection" : {
// //                             visibility: req.body.australiasecondvisibility,
// //                             secondtitle: req.body.australiasecondtitle,
// //                             seconddescription: req.body.australiaseconddescription,
// //                             secondorder: req.body.australiasecondorder,
// //                             secondtitle1: req.body.australiasecondtitle1,
// //                             seconddescription1: req.body.australiaseconddescription1,
// //                             secondorder1: req.body.australiasecondorder1,
// //                             secondtitle2: req.body.australiasecondtitle2,
// //                             seconddescription2: req.body.australiaseconddescription2,
// //                             secondorder2: req.body.australiasecondorder2,
// //                             secondtitle3: req.body.australiasecondtitle3,
// //                             seconddescription3: req.body.australiaseconddescription3,
// //                             secondorder3: req.body.australiasecondorder3,
// //                             secondtitle4: req.body.australiasecondtitle4,
// //                             seconddescription4: req.body.australiaseconddescription4,
// //                             secondorder4: req.body.australiasecondorder4
// //                         },
// //                         "thirdsection": {
// //                             visibility: req.body.australiathirdvisibility,
// //                             thirdtitle: req.body.australiathirdtitle,
// //                             thirddescription: req.body.australiathirddescription,
// //                             thirdbtntext: req.body.australiathirdbtntext,
// //                             thirdbtnlink: req.body.australiathirdbtnlink,
// //                             thirdimage: australiathirdLink,
// //                             thirdorder: req.body.australiathirdorder,
// //                             thirdtitle1: req.body.australiathirdtitle1,
// //                             thirddescription1: req.body.australiathirddescription1,
// //                             thirdbtntext1: req.body.australiathirdbtntext1,
// //                             thirdbtnlink1: req.body.australiathirdbtnlink1,
// //                             thirdorder1: req.body.australiathirdorder1,
// //                             thirdcopyimage_1: optionsData.australiathirdcopyimage_1,
// //                             thirdtitle2: req.body.australiathirdtitle2,
// //                             thirddescription2: req.body.australiathirddescription2,
// //                             thirdbtntext2: req.body.australiathirdbtntext2,
// //                             thirdbtnlink2: req.body.australiathirdbtnlink2,
// //                             thirdcopyimage_2: optionsData.australiathirdcopyimage_2,
// //                             thirdorder2:  req.body.australiathirdorder2
// //                         },

// //                         "fourthsection" : {
// //                             visibility: req.body.australiafourthvisibility,
// //                             fourthtitle: req.body.australiafourthtitle,
// //                             fourthauthor: req.body.australiafourthauthor,
// //                             fourthdescription: req.body.australiafourthdescription,
// //                             fourthtwitter: req.body.australiafourthtwitter,
// //                             fourthinsta: req.body.australiafourthinsta,
// //                             fourthfb: req.body.australiaourthfb,
// //                             fourthimage: australiafourthLink,
// //                             fourthorder: req.body.australiafourthorder,   
// //                         }
// //                     };
// //                 }
// //                 page.pagecontent       = continentData;
// //             } else {
// //                 let usathirdLink = req.body.usathirdimagelink;
// //                     if(usathirdLink) {
// //                         usathirdLink.map( async (item, linkindex)=> {
// //                             if(item == "") {
// //                                 let key = 'usathirdimage'+linkindex;
// //                                 filesArray.map( async (item, fileindex)=> {
// //                                     if(item.fieldname == key){
// //                                         usathirdLink[linkindex] = item.location; 
// //                                     }
// //                                 });  
// //                             }
// //                         });
// //                     }
                    
// //                     let usafourthLink = req.body.usafourthimagelink;
// //                     if(usafourthLink) {
// //                         usafourthLink.map( async (item, linkindex)=> {
// //                             if(item == "") {
// //                                 let key = 'usafourthimage'+linkindex;
// //                                 filesArray.map( async (item, fileindex)=> {
// //                                     if(item.fieldname == key){
// //                                         usafourthLink[linkindex] = item.location; 
// //                                     }
// //                                 });  
// //                             }
// //                         });
// //                     }

// //                 items["firstsection"]  = {
// //                     visibility: req.body.usafirstvisibility,
// //                     title: req.body.usafirsttitle,
// //                     author: req.body.usafirstauthor,
// //                     date: req.body.usafirstdate,
// //                     description: req.body.usafirstdescription,
// //                     firstorder: req.body.usafirstorder,
// //                     firstimage: optionsData.usafirstimage
// //                 }

// //                 items["secondsection"] = {
// //                     visibility: req.body.usasecondvisibility,
// //                     secondtitle: req.body.usasecondtitle,
// //                     seconddescription: req.body.usaseconddescription,
// //                     secondorder: req.body.usasecondorder,
// //                     secondtitle1: req.body.usasecondtitle1,
// //                     seconddescription1: req.body.usaseconddescription1,
// //                     secondorder1: req.body.usasecondorder1,
// //                     secondtitle2: req.body.usasecondtitle2,
// //                     seconddescription2: req.body.usaseconddescription2,
// //                     secondorder2: req.body.usasecondorder2,
// //                     secondtitle3: req.body.usasecondtitle3,
// //                     seconddescription3: req.body.usaseconddescription3,
// //                     secondorder3: req.body.usasecondorder3,
// //                     secondtitle4: req.body.usasecondtitle4,
// //                     seconddescription4: req.body.usaseconddescription4,
// //                     secondorder4: req.body.usasecondorder4
// //                 }

// //                 items["thirdsection"]  = {
// //                     visibility: req.body.usathirdvisibility,
// //                     thirdtitle: req.body.usathirdtitle,
// //                     thirddescription: req.body.usathirddescription,
// //                     thirdbtntext: req.body.usathirdbtntext,
// //                     thirdbtnlink: req.body.usathirdbtnlink,
// //                     thirdimage: usathirdLink,
// //                     thirdorder: req.body.usathirdorder,
// //                     thirdtitle1: req.body.usathirdtitle1,
// //                     thirddescription1: req.body.usathirddescription1,
// //                     thirdbtntext1: req.body.usathirdbtntext1,
// //                     thirdbtnlink1: req.body.usathirdbtnlink1,
// //                     thirdorder1: req.body.usathirdorder1,
// //                     thirdcopyimage_1: optionsData.usathirdcopyimage_1,
// //                     thirdtitle2: req.body.usathirdtitle2,
// //                     thirddescription2: req.body.usathirddescription2,
// //                     thirdbtntext2: req.body.usathirdbtntext2,
// //                     thirdbtnlink2: req.body.usathirdbtnlink2,
// //                     thirdcopyimage_2: optionsData.usathirdcopyimage_2,
// //                     thirdorder2:  req.body.usathirdorder2
// //                 };

// //                 items["fourthsection"] = {
// //                     visibility: req.body.usafourthvisibility,
// //                     fourthtitle: req.body.usafourthtitle,
// //                     fourthauthor: req.body.usafourthauthor,
// //                     fourthdescription: req.body.usafourthdescription,
// //                     fourthtwitter: req.body.usafourthtwitter,
// //                     fourthinsta: req.body.usafourthinsta,
// //                     fourthfb: req.body.usafourthfb,
// //                     fourthimage: usafourthLink,
// //                     fourthorder: req.body.usafourthorder   
// //                 };
// //                 page.pagecontent       = items;
// //             }
           
// //             page.save(function (err) {
// //                 if (err) {
// //                     res.json({ 'success': false, 'message': 'Error in Saving Page', 'errors': err });
// //                     return;
// //                 } else {
// //                     res.redirect('/pages/all');
// //                 }
// //             });
// //         } else if(req.body.layout == 'html'){
// //             let page               = new Page();
// //             let trimmed            = req.body.title;
// //             page.title             = trimmed.trim();
// //             page.layout            = 'html';
// //             page.pagetype          = req.body.pagetype;
// //             page.country           = req.body.country;
// //             page.pagecontent       = req.body.htmlcode;
// //             page.save(function (err) {
// //                 if (err) {
// //                     res.json({ 'success': false, 'message': 'Error in Saving Page', 'errors': err });
// //                     return;
// //                 } else {
// //                     res.redirect('/pages/all');
// //                 }
// //             }); 
// //         } else if(req.body.layout == 'layout2') {
// //             let optionsData = {};
// //             if(req.files) {
// //                 filesArray.map( async (item, index)=> {
// //                     let fieldname           = item.fieldname
// //                     optionsData[fieldname]  = item.location;
// //                 });
// //             }

// //             let page                = new Page();
// //             let trimmed             = req.body.title;
// //             page.title              = trimmed.trim();
// //             page.layout             = req.body.layout;
// //             page.common             = req.body.layout2common;
// //             let items               = {};
// //             let continentData       = {};
// //             if(req.body.layout2common == "no") {
// //                 let regions             = req.body.pageregion;
// //                 let usaCheck            = regions.includes("usa");
// //                 let europeCheck         = regions.includes("europe");
// //                 let australiaCheck      = regions.includes("australia");
// //                 if(usaCheck == true) {
// //                     let usafourthImageLink = req.body.usafourthimagelink;
// //                     if(usafourthImageLink) {
// //                         usafourthImageLink.map( async (item, linkindex)=> {
// //                             if(item == "") {
// //                                 let key = 'usafourthimage'+linkindex;
// //                                 filesArray.map( async (item, fileindex)=> {
// //                                     if(item.fieldname == key){
// //                                         usafourthImageLink[linkindex] = item.location; 
// //                                     }
// //                                 });  
// //                             }
// //                         });
// //                     }
// //                     continentData['usa'] = {
// //                         "firstsection" : {
// //                             visibility: req.body.usafirstvisibility,
// //                             title: req.body.usafirsttitle,
// //                             description: req.body.usafirstdescription,
// //                             btntext: req.body.usafirstbtntext,
// //                             btnlink: req.body.usafirstbtnlink,
// //                             firstbgimage: optionsData.usafirstbgimage
// //                         },
// //                         "secondsection" : {
// //                             visibility: req.body.usasecondvisibility,
// //                             secondtitle: req.body.usasecondtitle,
// //                             secondsubtitle: req.body.usasecondsubtitle,
// //                             seconddiseases: req.body.usaseconddiseases
// //                         },
// //                         "thirdsection": {
// //                             visibility: req.body.usathirdvisibility,
// //                             thirdtitle: req.body.usathirdstitle,
// //                             thirdfirstdescription: req.body.usathirdfirstdescription,
// //                             thirddiseases: req.body.usathirddiseases,
// //                             thirdseconddescription: req.body.usathirdseconddescription,
// //                             thirdbtntext: req.body.usathirdbtntext,
// //                             thirdbtnlink: req.body.usathirdbtnlink,
// //                             thirdslinktext: req.body.usathirdslinktext,
// //                             thirdsbtnlink: req.body.usathirdsbtnlink
// //                         },

// //                         "fourthsection" : {
// //                             visibility: req.body.usafourthvisibility,
// //                             fourthtitle: req.body.usafourthtitle,
// //                             fourthlink: req.body.usafourthlink,
// //                             fourthimage: usafourthImageLink   
// //                         }
// //                     };
                    
// //                 }
// //                 if(europeCheck == true) {
// //                     let europefourthImageLink = req.body.europefourthimagelink;
// //                     if(europefourthImageLink) {
// //                         europefourthImageLink.map( async (item, linkindex)=> {
// //                             if(item == "") {
// //                                 let key = 'europefourthimage'+linkindex;
// //                                 filesArray.map( async (item, fileindex)=> {
// //                                     if(item.fieldname == key){
// //                                         europefourthImageLink[linkindex] = item.location; 
// //                                     }
// //                                 });  
// //                             }
// //                         });
// //                     }
// //                     continentData['europe'] = {
// //                         "firstsection" : {
// //                             visibility: req.body.europefirstvisibility,
// //                             title: req.body.europefirsttitle,
// //                             description: req.body.europefirstdescription,
// //                             btntext: req.body.europefirstbtntext,
// //                             btnlink: req.body.europefirstbtnlink,
// //                             firstbgimage: optionsData.europefirstbgimage
// //                         },
// //                         "secondsection" : {
// //                             visibility: req.body.europesecondvisibility,
// //                             secondtitle: req.body.europesecondtitle,
// //                             secondsubtitle: req.body.europesecondsubtitle,
// //                             seconddiseases: req.body.europeseconddiseases
// //                         },
// //                         "thirdsection": {
// //                             visibility: req.body.europethirdvisibility,
// //                             thirdtitle: req.body.europethirdstitle,
// //                             thirdfirstdescription: req.body.europethirdfirstdescription,
// //                             thirddiseases: req.body.europethirddiseases,
// //                             thirdseconddescription: req.body.europethirdseconddescription,
// //                             thirdbtntext: req.body.europethirdbtntext,
// //                             thirdbtnlink: req.body.europethirdbtnlink,
// //                             thirdslinktext: req.body.europethirdslinktext,
// //                             thirdsbtnlink: req.body.europethirdsbtnlink
// //                         },

// //                         "fourthsection" : {
// //                             visibility: req.body.europefourthvisibility,
// //                             fourthtitle: req.body.europefourthtitle,
// //                             fourthlink: req.body.europefourthlink,
// //                             fourthimage: europefourthImageLink   
// //                         }
// //                     };
// //                 }
// //                 if(australiaCheck == true) {
// //                     let australiafourthImageLink = req.body.australiafourthimagelink;
// //                     if(australiafourthImageLink) {
// //                         australiafourthImageLink.map( async (item, linkindex)=> {
// //                             if(item == "") {
// //                                 let key = 'australiafourthimage'+linkindex;
// //                                 filesArray.map( async (item, fileindex)=> {
// //                                     if(item.fieldname == key){
// //                                         australiafourthImageLink[linkindex] = item.location; 
// //                                     }
// //                                 });  
// //                             }
// //                         });
// //                     }
// //                     continentData['australia'] = {
// //                         "firstsection" : {
// //                             visibility: req.body.australiafirstvisibility,
// //                             title: req.body.australiafirsttitle,
// //                             description: req.body.australiafirstdescription,
// //                             btntext: req.body.australiafirstbtntext,
// //                             btnlink: req.body.australiafirstbtnlink,
// //                             firstbgimage: optionsData.australiafirstbgimage
// //                         },
// //                         "secondsection" : {
// //                             visibility: req.body.australiasecondvisibility,
// //                             secondtitle: req.body.australiasecondtitle,
// //                             secondsubtitle: req.body.australiasecondsubtitle,
// //                             seconddiseases: req.body.australiaseconddiseases
// //                         },
// //                         "thirdsection": {
// //                             visibility: req.body.australiathirdvisibility,
// //                             thirdtitle: req.body.australiathirdstitle,
// //                             thirdfirstdescription: req.body.australiathirdfirstdescription,
// //                             thirddiseases: req.body.australiathirddiseases,
// //                             thirdseconddescription: req.body.australiathirdseconddescription,
// //                             thirdbtntext: req.body.australiathirdbtntext,
// //                             thirdbtnlink: req.body.australiathirdbtnlink,
// //                             thirdslinktext: req.body.australiathirdslinktext,
// //                             thirdsbtnlink: req.body.australiathirdsbtnlink
// //                         },

// //                         "fourthsection" : {
// //                             visibility: req.body.australiafourthvisibility,
// //                             fourthtitle: req.body.australiafourthtitle,
// //                             fourthlink: req.body.australiafourthlink,
// //                             fourthimage: australiafourthImageLink   
// //                         }
// //                     };
// //                 }
// //                 page.pagecontent       = continentData;
// //             } else {
// //                 let usafourthImageLink = req.body.usafourthimagelink; usafourthimage  
// //                 if(usafourthImageLink) {
// //                     usafourthImageLink.map( async (item, linkindex)=> {
// //                         if(item == "") {
// //                             let key = 'usafourthimage'+linkindex;
// //                             filesArray.map( async (item, fileindex)=> {
// //                                 if(item.fieldname == key){
// //                                     usafourthImageLink[linkindex] = item.location; 
// //                                 }
// //                             });  
// //                         }
// //                     });
// //                 }

// //                 items["firstsection"]  = {
// //                     visibility: req.body.usafirstvisibility,
// //                     title: req.body.usafirsttitle,
// //                     description: req.body.usafirstdescription,
// //                     btntext: req.body.usafirstbtntext,
// //                     btnlink: req.body.usafirstbtnlink,
// //                     firstbgimage: optionsData.usafirstbgimage
// //                 }
    
// //                 items["secondsection"] = {
// //                     visibility: req.body.usasecondvisibility,
// //                     secondtitle: req.body.usasecondtitle,
// //                     secondsubtitle: req.body.usasecondsubtitle,
// //                     seconddiseases: req.body.usaseconddiseases
// //                 }
    
// //                 items["thirdsection"]  = {
// //                     visibility: req.body.usathirdvisibility,
// //                     thirdtitle: req.body.usathirdstitle,
// //                     thirdfirstdescription: req.body.usathirdfirstdescription,
// //                     thirddiseases: req.body.usathirddiseases,
// //                     thirdseconddescription: req.body.usathirdseconddescription,
// //                     thirdbtntext: req.body.usathirdbtntext,
// //                     thirdbtnlink: req.body.usathirdbtnlink,
// //                     thirdslinktext: req.body.usathirdslinktext,
// //                     thirdsbtnlink: req.body.usathirdsbtnlink
// //                 };
    
// //                 items["fourthsection"] = {
// //                     visibility: req.body.usafourthvisibility,
// //                     fourthtitle: req.body.usafourthtitle,
// //                     fourthlink: req.body.usafourthlink,
// //                     fourthimage: usafourthImageLink
// //                 };
// //                 page.pagecontent       = items;
// //             }
           
// //             page.save(function (err) {
// //                 if (err) {
// //                     res.json({ 'success': false, 'message': 'Error in Saving Page', 'errors': err });
// //                     return;
// //                 } else {
// //                     res.redirect('/pages/all');
// //                 }
// //             });
// //         }else { 
// //             let optionsData = {};
// //             if(req.files) {
// //                 filesArray.map( async (item, index)=> {
// //                     let fieldname           = item.fieldname
// //                     optionsData[fieldname]  = item.location;
// //                 });
// //             }
// //             let page               = new Page();
// //             let trimmed            = req.body.title;
// //             page.title             = trimmed.trim();
// //             page.pagetype          = req.body.pagetype;
// //             page.layout            = "home";
// //             page.country           = req.body.country;
// //             let items              = {};

// //             items["firstsection"]  = {title: req.body.firsttitle, description: req.body.firstdescription, visibility: req.body.firstvisibility, btntext: req.body.firstbtntext, btnlink: req.body.firstbtnlink, imagelink: optionsData.firstimage};

// //             items["secondsection"] = {title: req.body.secondtitle, description: req.body.seconddescription, visibility: req.body.secondvisibility, linktext: req.body.secondlinktext, btnlink: req.body.secondlink};

// //             items["thirdsection"]  = {stitle: req.body.thirdstitle, title: req.body.thirdtitle, description: req.body.thirddescription, visibility: req.body.thirdvisibility, btntext: req.body.thirdbtntext, btnlink: req.body.thirdbtnlink, imagelink: optionsData.thirdimage};

// //             items["fourthsection"] = {stitle: req.body.fourthstitle, title: req.body.fourthtitle, description: req.body.fourthdescription, visibility: req.body.fourthvisibility, btntext: req.body.fourthbtntext, btnlink: req.body.fourthbtnlink, imagelink: optionsData.fourthimage};

// //             items["fifthsection"]  = {stitle: req.body.fifthstitle, title: req.body.fifthtitle, description: req.body.fifthdescription, visibility: req.body.fifthvisibility, btntext: req.body.fifthbtntext, btnlink: req.body.fifthbtnlink, imagelink: optionsData.fifthimage};

// //             items["sixthsection"]  = {title: req.body.sixthtitle, description: req.body.sixthdescription, visibility: req.body.sixthsectionvisibility};

// //             page.pagecontent       = items;
// //             page.save(function (err) {
// //                 if (err) {
// //                     res.json({ 'success': false, 'message': 'Error in Saving Page', 'errors': err });
// //                     return;
// //                 } else {
// //                     res.redirect('/pages/all');
// //                 }
// //             });
// //         }
// //     }
// // });

// router.get('/all', ensureAuthenticated, function (req, res) {
//     Page.find({}).sort({_id: 'desc'}).exec(function (err, pages) {
//         if(err) {
//             console.log(err);
//         } else {
//             res.render('all_pages.hbs', {
//                 pageTitle: 'All Pages',
//                 pages: pages
//             });
//         }
//     });
// });

// router.get('/edit/:id', ensureAuthenticated, function (req, res) {
//     let layoutDropDown  = {};
//     layoutDropDown.layout1 = "Layout1";
//     layoutDropDown.home = "Home";
//     layoutDropDown.layout2 = "Layout2";
//     layoutDropDown.html = "HTML";
//     Page.findById(req.params.id).then((result) => pages(result)).catch((err) => res.status(404).json({success: false, message: err }));
//     function pages(page){
//         if(page){
//             let pageContent = page.pagecontent;
//             let pageLayout = page.layout;
//             console.log(pageLayout);
//             let templateName;
//             if(pageLayout == 'layout1') {
//                 templateName = 'edit-page-layoutone.hbs';
//             } else if(pageLayout == 'html') {
//                 templateName = 'edit-page-html.hbs';
//             } else if(pageLayout == 'layout2') {
//                 templateName = 'edit-page-layouttwo.hbs';
//             }else {
//                 templateName = 'edit-page.hbs';
//             }
            
//             res.status(200).render(templateName, {
//                 pageTitle: 'Edit '+page.title,
//                 title: page.title,
//                 section: 'page',
//                 pagelayout: page.layout,
//                 country: page.country,
//                 pagecontent: pageContent,
//                 pageid: req.params.id,
//                 layoutDropDown: layoutDropDown,
//                 pagetype: pagetype,
//                 selectedpage: page.pagetype,
//                 countries: countries,
//                 action: 'edit'
//             });
//         } else {
//             res.status(404).json({success: false, message: "error in getting result"});
//         }
//     }
// });

// router.post('/edit/:id', upload.any(), async (req, res) => {
//     req.checkBody('title', 'Page Title is required').notEmpty();
//     req.checkBody('layout', 'Page Layout is required').notEmpty();
//     req.checkBody('country', 'Page Country is required').notEmpty();
//     let errors = req.validationErrors();
//     let filesArray = req.files;
//     if (errors) return res.status(404).json({ 'success': false, 'message': errors});
//     if(req.body.titlelayout1) {
//         let optionsData = {};
//         if(req.files) {
//             filesArray.map( async (item, index)=> {
//                 let fieldname           = item.fieldname
//                 optionsData[fieldname]  = item.location;     
//             });
//         }

        
//         let thirdLink = req.body.thirdimagelink;
//         if(thirdLink) {
//             thirdLink.map( async (item, linkindex)=> {
//                 if(item == "") {
//                     let key = 'thirdimage'+linkindex;
//                     filesArray.map( async (item, fileindex)=> {
//                         if(item.fieldname == key){
//                          thirdLink[linkindex] = item.location; 
//                         }
//                     });  
//                 }
//              });
//         }
        

//         let fourthLink = req.body.fourthimagelink;
//         if(fourthLink) {
//             fourthLink.map( async (item, linkindex)=> {
//                 if(item == "") {
//                     let key = 'fourthimage'+linkindex;
//                     filesArray.map( async (item, fileindex)=> {
//                         if(item.fieldname == key){
//                          fourthLink[linkindex] = item.location; 
//                         }
//                     });  
//                 }
//              });
//         }
        
//         let page               = {};
//         let trimmed            = req.body.title;
//         page.title             = trimmed.trim();
//         page.layout            = 'layout1';
//         page.pagetype          = req.body.pagetype;
//         page.country           = req.body.country;
//         let items              = {};

    
//         if (optionsData.firstimage === undefined || optionsData.firstimage === null) {
//             optionsData.firstimage = req.body.firstimagelink;
//         }

//         if (optionsData.thirdcopyimage_1 === undefined || optionsData.thirdcopyimage_1 === null) {
//             optionsData.thirdcopyimage_1 = req.body.thirdcopyimagelink_1;
//         }

//         if (optionsData.thirdcopyimage_2 === undefined || optionsData.thirdcopyimage_2 === null) {
//             optionsData.thirdcopyimage_2 = req.body.thirdcopyimagelink_2;
//         }


//         items["firstsection"]  = {
//             visibility: req.body.firstvisibility,
//             title: req.body.firsttitle,
//             author: req.body.firstauthor,
//             date: req.body.firstdate,
//             description: req.body.firstdescription,
//             firstorder: req.body.firstorder,
//             firstimage: optionsData.firstimage
//         }

//         items["secondsection"] = {
//             visibility: req.body.secondvisibility,
//             secondtitle: req.body.secondtitle,
//             seconddescription: req.body.seconddescription,
//             secondorder: req.body.secondorder,
//             secondtitle1: req.body.secondtitle1,
//             seconddescription1: req.body.seconddescription1,
//             secondorder1: req.body.secondorder1,
//             secondtitle2: req.body.secondtitle2,
//             seconddescription2: req.body.seconddescription2,
//             secondorder2: req.body.secondorder2,
//             secondtitle3: req.body.secondtitle3,
//             seconddescription3: req.body.seconddescription3,
//             secondorder3: req.body.secondorder3,
//             secondtitle4: req.body.secondtitle4,
//             seconddescription4: req.body.seconddescription4,
//             secondorder4: req.body.secondorder4
//         }

//         items["thirdsection"]  = {
//             visibility: req.body.thirdvisibility,
//             thirdtitle: req.body.thirdtitle,
//             thirddescription: req.body.thirddescription,
//             thirdbtntext: req.body.thirdbtntext,
//             thirdbtnlink: req.body.thirdbtnlink,
//             thirdimage: thirdLink,
//             thirdorder: req.body.thirdorder,
//             thirdtitle1: req.body.thirdtitle1,
//             thirddescription1: req.body.thirddescription1,
//             thirdbtntext1: req.body.thirdbtntext1,
//             thirdbtnlink1: req.body.thirdbtnlink1,
//             thirdorder1: req.body.thirdorder1,
//             thirdcopyimage_1: optionsData.thirdcopyimage_1,
//             thirdtitle2: req.body.thirdtitle2,
//             thirddescription2: req.body.thirddescription2,
//             thirdbtntext2: req.body.thirdbtntext2,
//             thirdbtnlink2: req.body.thirdbtnlink2,
//             thirdcopyimage_2: optionsData.thirdcopyimage_2,
//             thirdorder2:  req.body.thirdorder2
  
//         };

//         items["fourthsection"] = {
//             visibility: req.body.fourthvisibility,
//             fourthtitle: req.body.fourthtitle,
//             fourthauthor: req.body.fourthauthor,
//             fourthdescription: req.body.fourthdescription,
//             fourthtwitter: req.body.fourthtwitter,
//             fourthinsta: req.body.fourthinsta,
//             fourthfb: req.body.fourthfb,
//             fourthorder: req.body.fourthorder,
//             fourthimage: fourthLink
//         };

//         page.pagecontent      = items;
//         let query = {_id:req.params.id}
//         Page.findOneAndUpdate(query, page, function(err){
//             if(err){
//                res.status(404).json({ 'success': false, 'message': 'Error in Updating Page', errors: err });
//             } else {
//                 let menuquery = {pageid:req.params.id};
//                 let menu               = {};
//                 menu.type             = req.body.pagetype;
//                 let trimmed            = req.body.title;
//                 menu.pagetitle         = trimmed.trim();
                       
//                 Menu.findOneAndUpdate(menuquery, menu, function(err){
//                     if(err){
//                        res.status(404).json({ 'success': false, 'message': 'Error in Updating Menu', errors: err });
//                     } else {
//                         res.status(200).json({ 'success': true, 'message': 'Page Updated'});
//                     }
//                 });
//             }
//         });
//     } else if(req.body.layout == 'html'){
//         let page               = {};
//         let trimmed            = req.body.title;
//         page.title             = trimmed.trim();
//         page.layout            = 'html';
//         page.pagetype          = req.body.pagetype;
//         page.country           = req.body.country;
//         page.pagecontent       = req.body.htmlcode;
//         let query = {_id:req.params.id}
//         Page.findOneAndUpdate(query, page, function(err){
//             if(err){
//                res.status(404).json({ 'success': false, 'message': 'Error in Updating Page', errors: err });
//             } else {
//                 let menuquery         = {pageid:req.params.id}
//                 let menu              = {};
//                 menu.type             = req.body.pagetype;
//                 menu.pagetitle        = req.body.title;
//                 Menu.findOneAndUpdate(menuquery, menu, function(err){
//                     if(err){
//                        res.status(404).json({ 'success': false, 'message': 'Error in Updating Menu', errors: err });
//                     } else {
//                         res.status(200).json({ 'success': true, 'message': 'Page Updated'});
//                     }
//                 });
//             }
//         });
//     } else if(req.body.layout == 'layout2') {
//         let optionsData = {};
//         if(req.files) {
//             filesArray.map( async (item, index)=> {
//                 let fieldname           = item.fieldname
//                 optionsData[fieldname]  = item.location;
//             });
//         }

//         let fourthImageLink = req.body.fourthimagelink;
//         if(fourthImageLink) {
//             fourthImageLink.map( async (item, linkindex)=> {
//                 if(item == "") {
//                     let key = 'fourthimage'+linkindex;
//                     filesArray.map( async (item, fileindex)=> {
//                         if(item.fieldname == key){
//                             fourthImageLink[linkindex] = item.location; 
//                         }
//                     });  
//                 }
//             });
//         }

//         if (optionsData.firstbgimage === undefined || optionsData.firstbgimage === null) {
//             optionsData.firstbgimage = req.body.firstimagelink;
//         }

//         let page               = {};
//         let trimmed            = req.body.title;
//         page.title             = trimmed.trim();
//         page.layout            = req.body.layout;
//         page.pagetype          = req.body.pagetype;
//         page.country           = req.body.country;
//         let items              = {};

//         items["firstsection"]  = {
//             visibility: req.body.firstvisibility,
//             title: req.body.firsttitle,
//             description: req.body.firstdescription,
//             btntext: req.body.firstbtntext,
//             btnlink: req.body.firstbtnlink,
//             firstbgimage: optionsData.firstbgimage
//         }

//         items["secondsection"] = {
//             visibility: req.body.secondvisibility,
//             secondtitle: req.body.secondtitle,
//             secondsubtitle: req.body.secondsubtitle,
//             seconddiseases: req.body.seconddiseases
//         }

//         items["thirdsection"]  = {
//             visibility: req.body.thirdvisibility,
//             thirdtitle: req.body.thirdstitle,
//             thirdfirstdescription: req.body.thirdfirstdescription,
//             thirddiseases: req.body.thirddiseases,
//             thirdseconddescription: req.body.thirdseconddescription,
//             thirdbtntext: req.body.thirdbtntext,
//             thirdbtnlink: req.body.thirdbtnlink,
//             thirdslinktext: req.body.thirdslinktext,
//             thirdsbtnlink: req.body.thirdsbtnlink
//         };

//         items["fourthsection"] = {
//             visibility: req.body.fourthvisibility,
//             fourthtitle: req.body.fourthtitle,
//             fourthlink: req.body.fourthlink,
//             fourthimage: fourthImageLink
//         };
//         page.pagecontent       = items;
//         let query = {_id:req.params.id}
//         Page.findOneAndUpdate(query, page, function(err){
//             if(err){
//                res.status(404).json({ 'success': false, 'message': 'Error in Updating Page', errors: err });
//             } else {
//                 let menuquery         = {pageid:req.params.id};
//                 let menu              = {};
//                 menu.type             = req.body.pagetype;
//                 menu.pagetitle        = req.body.title;
//                 Menu.findOneAndUpdate(menuquery, menu, function(err){
//                     if(err){
//                        res.status(404).json({ 'success': false, 'message': 'Error in Updating Menu', errors: err });
//                     } else {
//                         res.status(200).json({ 'success': true, 'message': 'Page Updated'});
//                     }
//                 });
//             }
//         });
//     } else {
//         let optionsData = {};
//         if(req.files) {
//             filesArray.map( async (item, index)=> {
//                 let fieldname           = item.fieldname
//                 optionsData[fieldname]  = item.location;
//             });
//         }

//         if(!optionsData.hasOwnProperty('firstimage')){
//             optionsData.firstimage = req.body.firstimagelink;
//         }

//         if(!optionsData.hasOwnProperty('thirdimage')){
//             optionsData.thirdimage = req.body.thirdimagelink;
//         }

//         if(!optionsData.hasOwnProperty('fourthimage')){
//             optionsData.fourthimage = req.body.fourthimagelink;
//         }

//         if(!optionsData.hasOwnProperty('fifthimage')){
//             optionsData.fifthimage = req.body.fifthimagelink;
//         }


//         let page               = {};
//         let trimmed            = req.body.title;
//         page.title             = trimmed.trim();
//         page.layout            = req.body.layout;
//         page.pagetype          = req.body.pagetype;
//         page.country           = req.body.country;
//         let items              = {};

//         items["firstsection"]  = {title: req.body.firsttitle, description: req.body.firstdescription, visibility: req.body.firstvisibility, btntext: req.body.firstbtntext, btnlink: req.body.firstbtnlink, imagelink: optionsData.firstimage};

//         items["secondsection"] = {title: req.body.secondtitle, description: req.body.seconddescription, visibility: req.body.secondvisibility, linktext: req.body.secondlinktext, btnlink: req.body.secondlink};

//         items["thirdsection"]  = {stitle: req.body.thirdstitle, title: req.body.thirdtitle, description: req.body.thirddescription, visibility: req.body.thirdvisibility, btntext: req.body.thirdbtntext, btnlink: req.body.thirdbtnlink, imagelink: optionsData.thirdimage};

//         items["fourthsection"] = {stitle: req.body.fourthstitle, title: req.body.fourthtitle, description: req.body.fourthdescription, visibility: req.body.fourthvisibility, btntext: req.body.fourthbtntext, btnlink: req.body.fourthbtnlink, imagelink: optionsData.fourthimage};

//         items["fifthsection"]  = {stitle: req.body.fifthstitle, title: req.body.fifthtitle, description: req.body.fifthdescription, visibility: req.body.fifthvisibility, btntext: req.body.fifthbtntext, btnlink: req.body.fifthbtnlink, imagelink: optionsData.fifthimage};

//         items["sixthsection"]  = {title: req.body.sixthtitle, description: req.body.sixthdescription, visibility: req.body.sixthsectionvisibility};

//         page.pagecontent      = items;
//         let query = {_id:req.params.id}
//         Page.update(query, page, function(err){
//             if(err){
//                 res.status(404).json({ 'success': false, 'message': 'Error in Updating Page', errors: err });
//             } else {
//                 let menuquery         = {pageid:req.params.id};
//                 let menu               = {};
//                 menu.type             = req.body.pagetype;
//                 menu.pagetitle        = req.body.title;
//                 Menu.findOneAndUpdate(menuquery, menu, function(err){
//                     if(err){
//                        res.status(404).json({ 'success': false, 'message': 'Error in Updating Menu', errors: err });
//                     } else {
//                         res.status(200).json({ 'success': true, 'message': 'Page Updated'});
//                     }
//                 });
//             }
//         });
//     }
// });


// router.get('/pagecontent', async function (req, res) {
//     if(req.query.id){
//         Page.find({_id: req.query.id}).then((data) => res.json({status: true, content: data})).catch((err) => ({status: false, error: err}));
//     } else {
//         await Page.find().then((data) => check(data));
//         function check(data){ 
//             if(data.length >= 1){
//                 Page.findOne({title: req.query.layout, pagetype:req.query.type, country: req.query.country}).then((page_content) => redirect(page_content))        
//                 async function redirect(page_content){  console.log(page_content);    
//                     if(page_content !== null){
//                     // {
//                         // await Page.findOne({title: req.query.layout, pagetype:req.query.type, country: req.query.country}).select('-1').sort({_id: 'asc'}).then((content) => test(content));
//                         // function test(content){
//                             // if(content != null){
//                                 res.status(200).json({ 'success': true, 'content': page_content });
                           
//                         } else if(req.query.type == "home"){
//                             let pageContent  = await Page.findOne({title: 'Home USA', pagetype:"home", country: 'United States'}).select('-1');
//                             res.json({ 'success': true, 'error': 'Country not found', 'content':pageContent });
//                         } else if(req.query.type == 'faq'){
//                             let pageContent  = await Page.findOne({title: 'Faq USA', pagetype:"faq", country: 'United States'}).select('-1');
//                             res.status(200).json({ 'success': true, 'error': 'Country not found', 'content': pageContent });
//                         } else if(req.query.type == "about"){
//                             let pageContent  = await Page.findOne({title: 'About USA', pagetype:"about", country: 'United States'}).select('-1');
//                             res.status(200).json({ 'success': true, 'error': 'Country not found', 'content': pageContent });
//                         } else if(req.query.type == "contact"){
//                             let pageContent  = await Page.findOne({title: 'Contact USA', pagetype:"contact", country: 'United States'}).select('-1');
//                             res.status(200).json({ 'success': true, 'error': 'Country not found', 'content': pageContent });
//                         } else {
//                             res.status(404).json({success: false, 'content': "Page Not Found"});
//                         }
//                     }
//                 }
//             }
//         }
//     }
// );

// router.delete('/:id', ensureAuthenticated, function(req, res){
//     let query = {_id:req.params.id}
//     Page.findById(req.params.id, function(err, page){
//         Page.remove(query, function(err){
//           if(err){
//             console.log(err);
//           }
//           res.send('Success');
//         });
//     });
// });

// // Access Control
// function ensureAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     } else {
//         req.session.returnTo = req.originalUrl;
//         res.redirect('/users/login');
//     }
// }

// module.exports = router;
// // router.get('/allpages',function (req, res) {
// //     Page.find({}).sort({_id: 'desc'}).exec(function (err, pages) {
// //     if(err) {
// //         res.json({ 'success': false, 'message': err });
// //     } else {
// //         res.json({ 'success': true, 'pages': pages });
// //     }
// //   });
// // });

// // router.get('/add', ensureAuthenticated, function (req, res) {
// //     let layoutDropDown  = {};
// //     layoutDropDown.home = "Home";
// //     layoutDropDown.contact = "Contact";
// //     layoutDropDown.shippingreturns = "Shipping & Returns";
// //     layoutDropDown.faq = "FAQ";
// //     layoutDropDown.about = "About";
// //     layoutDropDown.qualityguarantee = "Quality Guarantee";
// //     layoutDropDown.affiliateprogram = "Affiliate program";
// //     layoutDropDown.press = "Press";
// //     layoutDropDown.policies = "Policies";
// //     layoutDropDown.terms = "Terms";
// //     layoutDropDown.privacy = "Privacy";
// //     layoutDropDown.cookies = "Cookies";
// //     layoutDropDown.accessibility = "Accessibility";
// //     layoutDropDown.fda = "FDA"
// //     res.render('add-page.hbs', {
// //         pageTitle: 'Add Page',
// //         layoutDropDown: layoutDropDown,
// //         countries: countries,
// //         action: 'add'
// //     });
// // });


// //Add new html page route
// // router.get('/layout/html', async function(req, res){
// //     res.render('add-html.hbs', {
// //         pageTitle: 'Add html'
// //     });
// // });

//old code ends

const express       = require('express');
const router        = express.Router();
const cors          = require('cors');
const path          = require('path');
var aws             = require('aws-sdk');
var bodyParser      = require('body-parser');
var multer          = require('multer');
var multerS3        = require('multer-s3');
const bcrypt        = require('bcryptjs');
const db            = require('../config/database');
const User          = db.User;
const UserMeta      = db.UserMeta;
const Page          = db.Page;
const EasyPost = require('@easypost/api');
const OrderProduct = require("../models/order_product");
const Notify = require("../models/notification");
let pagetype = ["home", "faq", "contact", "about", "layout1", "privacy policy", "terms & conditions", "website accessbility", "learn", "shipping & returns", "Benefits of CBD", "comingsoon", "consult"];
aws.config.update({
    secretAccessKey: process.env.SECRETACCESSKEY,
    accessKeyId: process.env.ACCESSKEYID,
    region: process.env.REGION
});
const app = express();
const s3 = new aws.S3();
//Dont forget to change this
const apiKey = "EZTKabecb64c21dd48da9c2049dbce486899dlgd5K9QwNRQq4xhv01gJQ"

const api = new EasyPost(apiKey);
const OOrder = require("../models/order");
app.use(bodyParser.json());

// const upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: process.env.BUCKET,
//         metadata: function (req, file, cb) {
//         cb(null, {fieldName: file.fieldname});
//         },
//         key: function (req, file, cb) {
//             cb(null, Date.now() + '-prd-' + file.originalname);
//         }
//     }),
//     fileFilter: function (req, file, callback) {
//         var ext = path.extname(file.originalname);
//         if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
//             req.fileValidationError = "Forbidden extension";
//             return callback(null, false, req.fileValidationError);
//         }
//         callback(null, true)
//     },
//     limits:{
//         fileSize: 420 * 150 * 200
//     }
// });

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/images/uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' +  Date.now() + path.extname(file.originalname))
    }
});
var upload = multer({storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            req.fileValidationError = "Forbidden extension";
            return callback(null, false, req.fileValidationError);
        }
        callback(null, true)
    },
    limits:{
        fileSize: 420 * 150 * 200
    }});



// const upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: process.env.BUCKET,
//         metadata: function (req, file, cb) {
//         cb(null, {fieldName: file.fieldname});
//         },
//         key: function (req, file, cb) {
//             cb(null, Date.now() + '-prd-' + file.originalname);
//         }
//     }),
//     fileFilter: function (req, file, callback) {
//         var ext = path.extname(file.originalname);
//         if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
//             req.fileValidationError = "Forbidden extension";
//             return callback(null, false, req.fileValidationError);
//         }
//         callback(null, true)
//     },
//     limits:{
//         fileSize: 420 * 150 * 200
//     }
// });



let countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua","Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas"
	,"Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia","Herzegovina","Botswana","Brazil","British Virgin Islands"
	,"Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica"
	,"Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea"
	,"Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana"
	,"Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India"
	,"Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia"
	,"Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania"
	,"Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia"
	,"New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal"
	,"Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre","Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles"
	,"Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts","Nevis","St Lucia","St Vincent","St. Lucia","Sudan"
	,"Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad ; Tobago","Tunisia"
	,"Turkey","Turkmenistan","Turks","Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","United States Minor Outlying Islands","Uruguay"
	,"Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

router.get("/orders/alerts/:id", async function(req, res){

    Notify.findOneAndUpdate({_id: req.params.id}, {$set: {
        "readflag" : true
    }}).then(() => res.redirect("/pages/orders/allalerts"));
});

//Displaying all Notifications
router.get("/orders/allalerts", async function(req, res){
    
    Notify.find({"readflag" : false}).then((data) => show(data));

    function show(data){
    res.status(200).render('alerts.hbs', {
        pageTitle: 'All Alerts',
        alerts: data
    });
} 
});

//post layout page 
// router.post("/layout/add", async function(req, res){
//     console.log({data:req.body});
// });

//Route to process any particular Order
router.get("/orders/process/:id", async function(req, res){
    res.status(200).render('process.hbs', {
        pageTitle: 'Process Order'
    });   
});

// //Route to delet any particular order
// router.get("/orders/delete/:id", function(req, res){
//     let query = req.params.id;
    
//     OrderProduct.findById(query, function(err, product){
//         OrderProduct.remove({query}, function(err){
//           if(err){
//             console.log(err);
//           } else {
//               res.redirect('/pages/orders/all');}
//         });
//     });
// });

//viewing order 
router.get("/orders/view/:id", async function(req, res){
    let query = req.params.id;
    OOrder.find({_id: query}).populate("products").exec(function(err, orders){
        if(err){
            res.json({status: false, error: err})
        } else {
            let trackerid
            if(orders[0].carrier !== 'shipment_failed'){
             trackerid = orders[0].trackerId;
                api.Tracker.retrieve(trackerid).then(s => sendTrackingId(s)).catch(console.log);}
                else {
                    trackerid = "Not found"
                    let data = {
                        public_url: "Not found"
                    }
                    sendTrackingId(data)
                }
				function sendTrackingId(data){
                    let roundup = orders[0].grandtotal;
                    let orderwithtracking = {...orders[0], trackurl: data.public_url};
                    console.log(orderwithtracking._doc)
                    let fees = orderwithtracking._doc.fees
                    console.log({fees})
                    console.log({"trackerurl":data.public_url})
            res.status(200).render('view_order.hbs', {
                pageTitle: 'View Ordered Products',
                orders,
                trackerurl: data.public_url,
                fees
            });    
        }}
    });
});

// Route to get all orders
// router.get('/orders/all', function (req, res) {
// OrderProduct.find({}).
//       sort({_id: 'desc'}).
//       exec(function (err, orders) {
//         if(err) {
//             console.log(err);
//         } else {
//             res.render('all_orders.hbs', {
//                 pageTitle: 'All Orders',
//                 orders: orders 
//             });
//     //     }
//     //   });
    
//     // res.status({data});
//     }})});

//create new Layout page
router.get('/layout/add', function (req, res) {
    let layoutDropDown  = {};
    //layoutDropDown.layout1 = "Layout One Template";
    //layoutDropDown.home = "Layout Two/Home Template";
    //layoutDropDown.layout2 = "Layout Three Template";
    layoutDropDown.html = "Default Template";
    res.render('add-layout.hbs', {
        pageTitle: 'Add Layout',
        section: 'page',
        layoutDropDown: layoutDropDown,
        countries: countries,
        pagetype: pagetype,
        action: 'add'
    });
});



router.get('/add', ensureAuthenticated, function (req, res) {
    let layoutDropDown  = {};
    layoutDropDown.home = "Home";
   layoutDropDown.contact = "Contact";
    layoutDropDown.shippingreturns = "Shipping & Returns";
    layoutDropDown.faq = "FAQ";
    layoutDropDown.about = "About";
    layoutDropDown.qualityguarantee = "Quality Guarantee";
    layoutDropDown.affiliateprogram = "Affiliate program";
    layoutDropDown.press = "Press";
    layoutDropDown.policies = "Policies";
    layoutDropDown.terms = "Terms";
    layoutDropDown.privacy = "Privacy";
    layoutDropDown.cookies = "Cookies";
    layoutDropDown.accessibility = "Accessibility";
    layoutDropDown.fda = "FDA"
    res.render('add-page.hbs', {
        pageTitle: 'Add Page',
        layoutDropDown: layoutDropDown,
        countries: countries,
        action: 'add'
    });
});


//Add new html page route
router.get('/layout/html', async function(req, res){
    res.render('add-html.hbs', {
        pageTitle: 'Add html'
    });
});

//code backup from the previous build 
router.post('/add', upload.any(), async function(req, res) {
    console.log({body: req.body})
    console.log({files: req.files})
    if(req.body.titlelayout1) {
        req.checkBody('titlelayout1', 'Page Title is required').notEmpty();
    } else {
        req.checkBody('title', 'Page Title is required').notEmpty();
    }
    
    // req.checkBody('country', 'Page Country is required').notEmpty();
    let errors = req.validationErrors();
    let filesArray = req.files;
    if (errors) {
        if(req.files) {
            filesArray.map( (item, index)=> {
                let insertfilename = item.path;
                var params = {
                    Bucket: 'elasticbeanstalk-us-east-2-797993184252',
                    Key: insertfilename
                };

                s3.deleteObject(params, function (err, data) {
                    if (data) {
                        console.log("File deleted successfully");
                    }
                    else {
                        console.log("Check if you have sufficient permissions : "+err);
                    }
                });
            });
        }
        return res.status(404).json({ 'success': false, 'message': 'validation error', "error": errors});
    }
    if(req.fileValidationError) return res.json({ 'success': false, 'message': 'File Validation error', errors: req.fileValidationError }); 
     
    let pageExist  = await Page.findOne({title: req.body.title}).select('-1').sort({_id: 'asc'});
    if(pageExist){
        res.json({ 'success': false, 'message': 'Page already exist with this Title', 'serialerror': 'Page already exist with this Title' });
    } else {
        if(req.body.titlelayout1){
            let optionsData = {};
            console.log(req.body);
            console.log({files: req.files})
            if(req.files) {
                filesArray.map( async (item, index)=> {
                    let fieldname           = item.fieldname
                    optionsData[fieldname]  = item.path;
                });
            }
            let page               = new Page();
            page.title             = req.body.titlelayout1.trim();
            page.layout            = 'layout1';
            page.continent         = "All";
            page.pagetype          = req.body.pagetype;
            let items              = {};

           
            let secondLink = req.body.secondimagelink;
            if(secondLink) {
                secondLink.map( async (item, linkindex)=> {
                    let tt;
                    if(item == "") {
                        if(linkindex == 0){
                            tt = 'secondimage'
                        } else {
                        tt = 'secondimage'+linkindex;}
                        filesArray.map( async (item, fileindex)=> {
                            if(item.fieldname == tt){
                                console.log(tt)
                            secondLink[linkindex] = item.path; 
                            console.log(item.path)
                            }
                        });  
                    }
                });
            }
            
            let thirdLink = req.body.thirdimagelink;
            if(thirdLink) {
                thirdLink.map( async (item, linkindex)=> {
                    let key;
                    if(item == "") {
                        if(linkindex == 0){
                            key = 'thirdimage'
                        } else {
                        key = 'thirdimage'+linkindex;}
                        filesArray.map( async (item, fileindex)=> {
                            if(item.fieldname == key){
                                console.log(item.fieldname, key)
                            thirdLink[linkindex] = item.path; 
                            console.log(item.path)
                            }
                        });  
                    }
                });
            }

            let fourthLink = req.body.fourthimagelink;
            if(fourthLink) {
                fourthLink.map( async (item, linkindex)=> {
                    let key;
                    if(item == "") {
                        if(linkindex == 0){
                            key = 'fourthimage'
                        } else 
                        {key = 'fourthimage'+linkindex;}
                        filesArray.map( async (item, fileindex)=> {
                            if(item.fieldname == key){
                                console.log(item.fieldname, key)
                            fourthLink[linkindex] = item.path; 
                            console.log(item.path)
                        }
                        });  
                    }
                });
            }




            items["firstsection"]  = {
                visibility: req.body.firstvisibility,
                title: req.body.firsttitle,
                author: req.body.firstauthor,
                date: req.body.firstdate,
                description: req.body.firstdescription,
                firstorder: req.body.firstorder,
                firstimage: optionsData.firstimage
            }

            items["secondsection"] = {
                visibility: req.body.secondvisibility,
                secondtitle: req.body.secondtitle,
                seconddescription: req.body.seconddescription,
                secondimage: secondLink,
                secondorder: req.body.secondorder,
                secondtitle1: req.body.secondtitle1,
                seconddescription1: req.body.seconddescription1,
                secondimage1: optionsData.secondimage11,
                secondorder1: req.body.secondorder1,
                secondtitle2: req.body.secondtitle2,
                seconddescription2: req.body.seconddescription2,
                secondimage2: optionsData.secondimage21,
                secondorder2: req.body.secondorder2,
                secondtitle3: req.body.secondtitle3,
                seconddescription3: req.body.seconddescription3,
                secondimage3: optionsData.secondimage31,
                secondorder3: req.body.secondorder3,
                secondtitle4: req.body.secondtitle4,
                seconddescription4: req.body.seconddescription4,
                secondimage4: optionsData.secondimage41,
                secondorder4: req.body.secondorder4
            }

            items["thirdsection"]  = {
                visibility: req.body.thirdvisibility,
                thirdtitle: req.body.thirdtitle,
                thirddescription: req.body.thirddescription,
                thirdbtntext: req.body.thirdbtntext,
                thirdbtnlink: req.body.thirdbtnlink,
                thirdimage: thirdLink,
                thirdorder: req.body.thirdorder,
                thirdtitle1: req.body.thirdtitle1,
                thirddescription1: req.body.thirddescription1,
                thirdbtntext1: req.body.thirdbtntext1,
                thirdbtnlink1: req.body.thirdbtnlink1,
                thirdorder1: req.body.thirdorder1,
                thirdcopyimage_1: optionsData.thirdcopyimage_1,
                thirdtitle2: req.body.thirdtitle2,
                thirddescription2: req.body.thirddescription2,
                thirdbtntext2: req.body.thirdbtntext2,
                thirdbtnlink2: req.body.thirdbtnlink2,
                thirdcopyimage_2: optionsData.thirdcopyimage_2,
                thirdorder2:  req.body.thirdorder2
            };

            items["fourthsection"] = {
                visibility: req.body.thirdvisibility,
                fourthtitle: req.body.fourthtitle,
                fourthauthor: req.body.fourthauthor,
                fourthdescription: req.body.fourthdescription,
                fourthtwitter: req.body.fourthtwitter,
                fourthinsta: req.body.fourthinsta,
                fourthfb: req.body.fourthfb,
                fourthimage: fourthLink,
                fourthorder: req.body.fourthorder,   
            };
            page.pagecontent       = items;
            page.save(function (err) {
                if (err) {
                    res.json({ 'success': false, 'message': 'Error in Saving Page', 'errors': err });
                    return;
                } else {
                    res.redirect('/pages/all');
                }
            });
        } else if(req.body.layout == 'html'){
            let page               = new Page();
            page.title             = req.body.title.trim();
            page.layout            = 'html';
            page.pagetype          = req.body.pagetype;
            page.continent         = "All";
            page.country           = req.body.country;
            page.pagecontent       = req.body.htmlcode;
            page.save(function (err) {
                if (err) {
                    res.json({ 'success': false, 'message': 'Error in Saving Page', 'errors': err });
                    return;
                } else {
                    res.redirect('/pages/all');
                }
            }); 
        } else if(req.body.layout == 'layout2') {
            let optionsData = {};
            if(req.files) {
                filesArray.map( async (item, index)=> {
                    let fieldname           = item.fieldname
                    optionsData[fieldname]  = item.path;
                });
            }
            console.log({optionsData})
            let fourthImageLink = req.body.fourthimagelink;
            if(fourthImageLink) {
                fourthImageLink.map( async (item, linkindex)=> {
                    if(item == "") {
                        let key = 'fourthimage'+linkindex;
                        filesArray.map( async (item, fileindex)=> {
                            if(item.fieldname == key){
                                fourthImageLink[linkindex] = item.path; 
                            }
                        });  
                    }
                });
            }

            console.log({fourthImageLink})
            let page               = new Page();
            page.title             = req.body.title.trim();
            page.layout            = req.body.layout;
            page.pagetype          = req.body.pagetype;
            page.continent         = "All";
            page.country           = req.body.country;
            let items              = {};
    
            items["firstsection"]  = {
                visibility: req.body.firstvisibility,
                title: req.body.firsttitle,
                description: req.body.firstdescription,
                btntext: req.body.firstbtntext,
                btnlink: req.body.firstbtnlink,
                firstbgimage: optionsData.firstbgimage
            }

            items["secondsection"] = {
                visibility: req.body.secondvisibility,
                secondtitle: req.body.secondtitle,
                secondsubtitle: req.body.secondsubtitle,
                seconddiseases: req.body.seconddiseases
            }


            let thirddarray = [];
            thirddarray.push(req.body.thirddiseases[0]);
            if(req.body.undefinedthirddiseases){
            let alength = req.body.undefinedthirddiseases.length - 1;
            for(i=0; i<= alength; i++){
                thirddarray.push(req.body.undefinedthirddiseases[i])
            }}
        
            let fourthdarray = [];
            fourthdarray.push(req.body.fourthtitle[0]);
            if(req.body.undefinedfourthtitle){
            let blength = req.body.undefinedfourthtitle.length - 1;
            for(i=0; i<= blength; i++){
                fourthdarray.push(req.body.undefinedfourthtitle[i])
            }}

            let fourthlinkdarray = [];
            fourthlinkdarray.push(req.body.fourthimagelink[0]);
            if(req.body.undefinedfourthimagelink){
            let clength = req.body.undefinedfourthimagelink.length - 1;
            for(i=0; i<= clength; i++){
                fourthlinkdarray.push(req.body.undefinedfourthimagelink[i])
            }}

            let fourthimglinkdarray = [];
            if(req.body.undefinedfourthlink){
            fourthimglinkdarray.push(req.body.fourthlink[0]);
            let dlength = req.body.undefinedfourthlink.length - 1;
            for(i=0; i<= dlength; i++){
                fourthimglinkdarray.push(req.body.undefinedfourthlink[i])
            }}
        
            items["thirdsection"]  = {
                visibility: req.body.thirdvisibility,
                thirdtitle: req.body.thirdstitle,
                thirdfirstdescription: req.body.thirdfirstdescription,
                thirddiseases: thirddarray,
                thirdseconddescription: req.body.thirdseconddescription,
                thirdbtntext: req.body.thirdbtntext,
                thirdbtnlink: req.body.thirdbtnlink,
                thirdslinktext: req.body.thirdslinktext,
                thirdsbtnlink: req.body.thirdsbtnlink
            };

            items["fourthsection"] = {
                visibility: req.body.fourthvisibility,
                fourthtitle: req.body.fourthtitle,
                fourthlink: req.body.fourthlink,
                fourthimage: fourthImageLink
            };
            page.pagecontent       = items;
            page.save(function (err) {
                if (err) {
                    res.json({ 'success': false, 'message': 'Error in Saving Page', 'errors': err });
                    return;
                } else {
                    res.redirect('/pages/all');
                }
            });
        }else { 
            let optionsData = {};
            if(req.files) {
                filesArray.map( async (item, index)=> {
                    let fieldname           = item.fieldname
                    optionsData[fieldname]  = item.path;
                });
            }
            let page               = new Page();
            page.title             = req.body.title.trim();
            page.pagetype          = req.body.pagetype;
            page.layout            = "home";
            page.continent         = "All";
            page.country           = req.body.country;
            let items              = {};

            items["firstsection"]  = {title: req.body.firsttitle, description: req.body.firstdescription, visibility: req.body.firstvisibility, btntext: req.body.firstbtntext, btnlink: req.body.firstbtnlink, imagelink: optionsData.firstimage};

            items["secondsection"] = {title: req.body.secondtitle, description: req.body.seconddescription, visibility: req.body.secondvisibility, linktext: req.body.secondlinktext, btnlink: req.body.secondlink};

            items["thirdsection"]  = {stitle: req.body.thirdstitle, title: req.body.thirdtitle, description: req.body.thirddescription, visibility: req.body.thirdvisibility, btntext: req.body.thirdbtntext, btnlink: req.body.thirdbtnlink, imagelink: optionsData.thirdimage};

            items["fourthsection"] = {stitle: req.body.fourthstitle, title: req.body.fourthtitle, description: req.body.fourthdescription, visibility: req.body.fourthvisibility, btntext: req.body.fourthbtntext, btnlink: req.body.fourthbtnlink, imagelink: optionsData.fourthimage};

            items["fifthsection"]  = {stitle: req.body.fifthstitle, title: req.body.fifthtitle, description: req.body.fifthdescription, visibility: req.body.fifthvisibility, btntext: req.body.fifthbtntext, btnlink: req.body.fifthbtnlink, imagelink: optionsData.fifthimage};

            items["sixthsection"]  = {title: req.body.sixthtitle, description: req.body.sixthdescription, visibility: req.body.sixthsectionvisibility};

            page.pagecontent       = items;
            page.save(function (err) {
                if (err) {
                    res.json({ 'success': false, 'message': 'Error in Saving Page', 'errors': err });
                    return;
                } else {
                    res.redirect('/pages/all');
                }
            });
        }
    }
});




// Old code containing the save logic for home and layout1
// router.post('/add', upload.any(), async function(req, res) {
//     if(req.body.titlelayout1) {
//         req.checkBody('titlelayout1', 'Page Title is required').notEmpty();
//     } else {
//         req.checkBody('title', 'Page Title is required').notEmpty();
//     }
    
//     // req.checkBody('country', 'Page Country is required').notEmpty();
//     let errors = req.validationErrors();
//     let filesArray = req.files;
//     if (errors) {
//         if(req.files) {
//             filesArray.map( (item, index)=> {
//                 let insertfilename = item.location;
//                 var params = {
//                     Bucket: 'elasticbeanstalk-us-east-2-797993184252',
//                     Key: insertfilename
//                 };

//                 s3.deleteObject(params, function (err, data) {
//                     if (data) {
//                         console.log("File deleted successfully");
//                     }
//                     else {
//                         console.log("Check if you have sufficient permissions : "+err);
//                     }
//                 });
//             });
//         }
//         return res.status(404).json({ 'success': false, 'message': 'validation error', "error": errors});
//     }
//     if(req.fileValidationError) return res.json({ 'success': false, 'message': 'File Validation error', errors: req.fileValidationError }); 
     
//     let pageExist  = await Page.findOne({title: req.body.title}).select('-1').sort({_id: 'asc'});
//     if(pageExist){
//         res.json({ 'success': false, 'message': 'Page already exist with this Title', 'serialerror': 'Page already exist with this Title' });
//     } else {
//         if(req.body.titlelayout1){
//             let optionsData = {};
//             if(req.files) {
//                 filesArray.map( async (item, index)=> {
//                     let fieldname           = item.fieldname
//                     optionsData[fieldname]  = item.location;
//                 });
//             }
//             let page               = new Page();
//             page.title             = req.body.titlelayout1;
//             page.layout            = 'layout1';
//             // page.pagetype          = req.body.pagetype;
//             page.continent           = ["North America",
//             "South America"];
//             let items              = {};

//             items["firstsection"]  = {
//                 visibility: req.body.firstvisibility,
//                 title: req.body.firsttitle,
//                 author: req.body.firstauthor,
//                 date: req.body.firstdate,
//                 description: req.body.firstdescription,
//                 firstorder: req.body.firstorder,
//                 imagelink: optionsData.firstimage
//             }

//             items["secondsection"] = {
//                 visibility: req.body.secondvisibility,
//                 secondtitle: req.body.secondtitle,
//                 seconddescription: req.body.seconddescription,
//                 secondorder: req.body.secondorder,
//                 secondtitle1: req.body.secondtitle1,
//                 seconddescription1: req.body.seconddescription1,
//                 secondorder1: req.body.secondorder1,
//                 secondtitle2: req.body.secondtitle2,
//                 seconddescription2: req.body.seconddescription2,
//                 secondorder2: req.body.secondorder2,
//                 secondtitle3: req.body.secondtitle3,
//                 seconddescription3: req.body.seconddescription3,
//                 secondorder3: req.body.secondorder3,
//                 secondtitle4: req.body.secondtitle4,
//                 seconddescription4: req.body.seconddescription4,
//                 secondorder4: req.body.secondorder4
//             }

//             items["thirdsection"]  = {
//                 visibility: req.body.thirdvisibility,
//                 thirdtitle: req.body.thirdtitle,
//                 thirddescription: req.body.thirddescription,
//                 thirdbtntext: req.body.thirdbtntext,
//                 thirdbtnlink: req.body.thirdbtnlink,
//                 imagelink: optionsData.thirdimage,
//                 thirdorder: req.body.thirdorder,
//                 thirdtitle1: req.body.thirdtitle1,
//                 thirddescription1: req.body.thirddescription1,
//                 thirdbtntext1: req.body.thirdbtntext1,
//                 thirdbtnlink1: req.body.thirdbtnlink1,
//                 thirdorder1: req.body.thirdorder1,
//                 imagelink1: optionsData.thirdimage1,
//                 thirdtitle2: req.body.thirdtitle2,
//                 thirddescription2: req.body.thirddescription2,
//                 thirdbtntext2: req.body.thirdbtntext2,
//                 thirdbtnlink2: req.body.thirdbtnlink2,
//                 imagelink2: optionsData.thirdimage2,
//                 thirdorder2:  req.body.thirdorder2
//             };

//             items["fourthsection"] = {
//                 visibility: req.body.thirdvisibility,
//                 fourthtitle: req.body.fourthtitle,
//                 fourthauthor: req.body.fourthauthor,
//                 fourthdescription: req.body.fourthdescription,
//                 fourthtwitter: req.body.fourthtwitter,
//                 fourthinsta: req.body.fourthinsta,
//                 fourthfb: req.body.fourthfb,
//                 fourthorder: req.body.fourthorder,   
//             };
//             page.pagecontent       = items;
//             page.save(function (err) {
//                 if (err) {
//                     res.json({ 'success': false, 'message': 'Error in Saving Page', 'errors': err });
//                     return;
//                 } else {
//                     res.redirect('/pages/all');
//                 }
//             });
//         } else if(req.body.layout == 'html'){
//             let page               = new Page();
//             page.title             = req.body.title;
//             page.layout            = 'html';
//             // page.pagetype          = req.body.pagetype;
//             page.continent           = ["North America",
//             "South America"];
//             page.pagecontent       = req.body.htmlcode;
//             page.save(function (err) {
//                 if (err) {
//                     res.json({ 'success': false, 'message': 'Error in Saving Page', 'errors': err });
//                     return;
//                 } else {
//                     res.redirect('/pages/all');
//                 }
//             }); 
//         } else { 
//             let optionsData = {};
//             if(req.files) {
//                 filesArray.map( async (item, index)=> {
//                     let fieldname           = item.fieldname
//                     optionsData[fieldname]  = item.location;
//                 });
//             }
//             let page               = new Page();
//             page.title             = req.body.title;
//             // page.pagetype          = req.body.pagetype;
//             page.layout            = "home";
//             page.continent           = ["North America",
//             "South America"];
//             let items              = {};

//             items["firstsection"]  = {title: req.body.firsttitle, description: req.body.firstdescription, visibility: req.body.firstvisibility, btntext: req.body.firstbtntext, btnlink: req.body.firstbtnlink, imagelink: optionsData.firstimage};

//             items["secondsection"] = {title: req.body.secondtitle, description: req.body.seconddescription, visibility: req.body.secondvisibility, linktext: req.body.secondlinktext, btnlink: req.body.secondlink};

//             items["thirdsection"]  = {stitle: req.body.thirdstitle, title: req.body.thirdtitle, description: req.body.thirddescription, visibility: req.body.thirdvisibility, btntext: req.body.thirdbtntext, btnlink: req.body.thirdbtnlink, imagelink: optionsData.thirdimage};

//             items["fourthsection"] = {stitle: req.body.fourthstitle, title: req.body.fourthtitle, description: req.body.fourthdescription, visibility: req.body.fourthvisibility, btntext: req.body.fourthbtntext, btnlink: req.body.fourthbtnlink, imagelink: optionsData.fourthimage};

//             items["fifthsection"]  = {stitle: req.body.fifthstitle, title: req.body.fifthtitle, description: req.body.fifthdescription, visibility: req.body.fifthvisibility, btntext: req.body.fifthbtntext, btnlink: req.body.fifthbtnlink, imagelink: optionsData.fifthimage};

//             items["sixthsection"]  = {title: req.body.sixthtitle, description: req.body.sixthdescription, visibility: req.body.sixthsectionvisibility};

//             page.pagecontent       = items;
//             page.save(function (err) {
//                 if (err) {
//                     res.json({ 'success': false, 'message': 'Error in Saving Page', 'errors': err });
//                     return;
//                 } else {
//                     res.redirect('/pages/all');
//                 }
//             });
//         }
//     }
// });

//route to assign continne to any particular page 
router.get('/continent/add', function(req, res){
    let continents = ["Africa","Europe","Asia","North America","South America","Australia"]
    Page.find({}).sort({_id: 'desc'}).exec(function (err, pages) {
        if(err) {
            console.log(err);
        } else {
            res.render('addcontinent.hbs', {
                pageTitle: 'Assign Continent',
                pages: pages,
                continents
            });
        }
    });
});



//route to assign continne to any particular page 
router.post('/continent/add/:id', function(req, res){
    let id = req.params.id;
    Page.findByIdAndUpdate(id, {$push:{continent: req.body.continent}} ).exec(function (err, pages) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/pages/layout/continent")
        }
    });
});

router.get('/all', ensureAuthenticated, function (req, res) {
    Page.find({}).sort({_id: 'desc'}).exec(function (err, pages) {
        if(err) {
            console.log(err);
        } else {
            res.render('all_pages.hbs', {
                pageTitle: 'All Pages',
                pages: pages
            });
        }
    });
});

router.get('/edit/:id', function (req, res) {
    let layoutDropDown  = {};
    layoutDropDown.layout1 = "Layout1";
    layoutDropDown.home = "Home";
    layoutDropDown.layout2 = "Layout2";
    layoutDropDown.html = "HTML";
    Page.findById(req.params.id).then((result) => pages(result)).catch((err) => res.status(404).json({success: false, message: err }));
    function pages(page){
        if(page){
            let pageContent = page.pagecontent;
            let pageLayout = page.layout;
            console.log(pageLayout);
            let templateName;
            if(pageLayout == 'layout1') {
                templateName = 'edit-page-layoutone.hbs';
            } else if(pageLayout == 'layout2') {
                templateName = 'edit-page-layouttwo.hbs';
            } else if(pageLayout == 'html') {
                templateName = 'edit-page-html.hbs';
            } else {
                templateName = 'edit-page.hbs';
            }
            
            res.status(200).render(templateName, {
                pageTitle: 'Edit '+page.title,
                title: page.title,
                section: 'page',
                pagelayout: page.layout,
                country: page.country,
                pagecontent: pageContent,
                pageid: req.params.id,
                layoutDropDown: layoutDropDown,
                pagetype: pagetype,
                selectedpage: page.pagetype,
                countries: countries,
                action: 'edit'
            });
        } else {
            res.status(404).json({success: false, message: "error in getting result"});
        }
    }
});

//code from the backup 
router.post('/edit/:id', upload.any(), async (req, res) => {

    
    req.checkBody('title', 'Page Title is required').notEmpty();
    req.checkBody('layout', 'Page Layout is required').notEmpty();
    req.checkBody('country', 'Page Country is required').notEmpty();
    let errors = req.validationErrors();
    let filesArray = req.files;
    if (errors) return res.status(404).json({ 'success': false, 'message': errors});
    if(req.body.titlelayout1) {
        let optionsData = {};
        console.log(req.files);
        let thirdImgArray = [];
        let thirdindex = 0;
        let fourthImgArray = [];
        let fourthindex = 0;
console.log(req.body)
        // let firstLink = req.body.firstimagelink;
        // if(firstLink) {
        //     firstLink.map( async (item, linkindex)=> {
        //         let ee;
        //         if(item == "") {
        //             ee = 'firstimage';
        //             filesArray.map( async (item, fileindex)=> {
        //                 if(item.fieldname == ee){
        //                     console.log(ee)
        //                 firstLink[linkindex] = item.location; 
        //                 console.log(item.location)
        //                 }
        //             });  
        //         }
        //     });
        // }
        // console.log({first: firstLink[0]})


        if(req.files) {
            filesArray.map( async (item, index)=> {
                if(item.fieldname == "thirdimage") {
                    thirdImgArray[thirdindex] = item.path;
                    thirdindex++;
                } else if(item.fieldname == "fourthimage") {
                    fourthImgArray[fourthindex] = item.path;
                    fourthindex++;
                } else {
                    let fieldname           = item.fieldname
                    optionsData[fieldname]  = item.path;     
                }
                
            });
        }
        
        let secondLink = req.body.secondimagelink;
            if(secondLink) {
                secondLink.map( async (item, linkindex)=> {
                    let tt;
                    if(item == "") {
                        if(linkindex == 0){
                            tt = 'secondimage'
                        } else {
                        tt = 'secondimage'+linkindex;}
                        filesArray.map( async (item, fileindex)=> {
                            if(item.fieldname == tt){
                            
                            secondLink[linkindex] = item.path; 
                
                            }
                        });  
                    }
                });
            }
           console.log(secondLink);
            let thirdLink = req.body.thirdimagelink;
            if(thirdLink) {
                thirdLink.map( async (item, linkindex)=> {
                    let key;
                    if(item == "") {
                        if(linkindex == 0){
                            key = 'thirdimage'
                        } else {
                        key = 'thirdimage'+linkindex;}
                        filesArray.map( async (item, fileindex)=> {
                            if(item.fieldname == key){
                            thirdLink[linkindex] = item.path; 
                            }
                        });  
                    }
                });
            }
        // let thirdLink = req.body.thirdimagelink;
        // if(thirdLink) {
        //     thirdLink.map( async (item, linkindex)=> {
        //         if(item == "") {
        //             let key = 'thirdimage'+linkindex;
        //             filesArray.map( async (item, fileindex)=> {
        //                 if(item.fieldname == key){
        //                  thirdLink[linkindex] = item.path; 
        //                 }
        //             });  
        //         }
        //      });
        // }
        

        let fourthLink = req.body.fourthimagelink;
        if(fourthLink) {
            fourthLink.map( async (item, linkindex)=> {
                if(item == "") {
                    let key = 'fourthimage'+linkindex;
                    filesArray.map( async (item, fileindex)=> {
                        if(item.fieldname == key){
                            console.log(item.fieldname, key)
                         fourthLink[linkindex] = item.path;
                         console.log(fourthLink[linkindex])
                         console.log(item.path)
                        }
                    });  
                }
             });
        }
        let page               = {};
        page.title             = req.body.title.trim();
        page.layout            = 'layout1';
        page.pagetype          = req.body.pagetype;
        page.country           = req.body.country;
        let items              = {};

    
        // if (optionsData.secondimage0 === undefined || optionsData.secondimage0 === null) {
        //     optionsData.secondimage0 = req.body.firstimagelink;
        // }

        if (optionsData.thirdcopyimage_1 === undefined || optionsData.thirdcopyimage_1 === null) {
            optionsData.thirdcopyimage_1 = req.body.thirdcopyimagelink_1;
        }

        if (optionsData.thirdcopyimage_1 === undefined || optionsData.thirdcopyimage_1 === null) {
            optionsData.thirdcopyimage_1 = req.body.thirdcopyimagelink_1;
        }


        if (optionsData.thirdcopyimage_2 === undefined || optionsData.thirdcopyimage_2 === null) {
            optionsData.thirdcopyimage_2 = req.body.thirdcopyimagelink_2;
        }

        var image111 = "";
        if(optionsData.firstimage){
            image111 = optionsData.firstimage
        } else if(req.body.firstimagelink){
            image111 = req.body.firstimagelink
        } 


        var image11 = "";
        if(optionsData.secondimage11){
            image11 = optionsData.secondimage11
        } else if(req.body.secondimage11.length > 1){
            image11 = req.body.secondimage11[0]
        } 

        var image21 = "";
        if(optionsData.secondimage21){image21 = optionsData.secondimage21} 
        else if(req.body.secondimage21){
        if(req.body.secondimage21.length > 1){
            image21 = req.body.secondimage21[0]
        } }

        var image31 = "";
        if(optionsData.secondimage41){
            image31 = optionsData.secondimage31
        } else if(req.body.secondimage31){
        if(req.body.secondimage31.length > 1){
            image31 = req.body.secondimage31[0]
        } }

        var image41 = "";
        if(optionsData.secondimage41) {
            image41 = optionsData.secondimage41}
        else if(req.body.secondimage41){
        if(req.body.secondimage41.length > 1){
            image41 = req.body.secondimage41[0]
        } }



        console.log({image11})
        console.log({image21})
        console.log({image31})
        console.log({image41})
        //For section 4 
        let iarray = Object.entries(optionsData);
        let final4array = [];
        let final4obj = {};
        let fourthi = iarray.map(function(el){
            var lastchar = el[0].substr(el[0].length - 1);
            let name = el[0].substring(0, el[0].length - 1);
            console.log({lastchar})
            console.log({name})
            if(name == "fourthimage"){
                
                final4obj[lastchar] = el[1];
                final4array.push(final4obj)
            }
        })
        Object.values(final4obj).map(function(el, index){
            final4 = replaceAt(fourthLink, el, final4obj[el])
        })
        const myVal = fourthLink.map((el, index) => {
            if(final4obj[index]){
                return final4obj[index]
            }
            return el
        })
        function replaceAt(array, index, value) {
            const ret = array.slice(0);
            ret[index] = value;
            return ret;
          }


          // for section 2
        let iarray2 = Object.entries(optionsData);
        let second4array = [];
        let second4obj = {};
        let secondi = iarray2.map(function(el){
            var lastchar2 = el[0].substr(el[0].length - 1);
            let name2 = el[0].substring(0, el[0].length - 1);
            console.log({lastchar2})
            console.log({name2})
            if(name2 == "secondimage"){
                
                second4obj[lastchar2] = el[1];
                second4array.push(second4obj)
            }
        })
        // Object.values(final4obj).map(function(el, index){
        //     final4 = replaceAt(fourthLink, el, final4obj[el])
        // })
        const myVal2 = secondLink.map((el, index) => {
            if(second4obj[index]){
                return second4obj[index]
            }
            return el
        })

        //section three
        let iarray3 = Object.entries(optionsData);
        let third4array = [];
        let third4obj = {};
        let thirdi = iarray3.map(function(el){
            var lastchar3 = el[0].substr(el[0].length - 1);
            let name3 = el[0].substring(0, el[0].length - 1);
            console.log({lastchar3})
            console.log({name3})
            if(name3 == "thirdimage"){
                
                third4obj[lastchar3] = el[1];
                third4array.push(third4obj)
            }
        })
        // Object.values(final4obj).map(function(el, index){
        //     final4 = replaceAt(fourthLink, el, final4obj[el])
        // })
        const myVal3 = thirdLink.map((el, index) => {
            if(third4obj[index]){
                return third4obj[index]
            }
            return el
        })

        items["firstsection"]  = {
            visibility: req.body.firstvisibility,
            title: req.body.firsttitle,
            author: req.body.firstauthor,
            date: req.body.firstdate,
            description: req.body.firstdescription,
            firstorder: req.body.firstorder,
            firstimage: image111
        }

        items["secondsection"] = {
            visibility: req.body.secondvisibility,
            secondtitle: req.body.secondtitle,
            seconddescription: req.body.seconddescription,
            secondimage: myVal2,
            secondorder: req.body.secondorder,
            secondtitle1: req.body.secondtitle1,
            seconddescription1: req.body.seconddescription1,
            secondimage1: image11,
            secondorder1: req.body.secondorder1,
            secondtitle2: req.body.secondtitle2,
            seconddescription2: req.body.seconddescription2,
            secondimage2: image21,
            secondorder2: req.body.secondorder2,
            secondtitle3: req.body.secondtitle3,
            seconddescription3: req.body.seconddescription3,
            secondimage3: image31,
            secondorder3: req.body.secondorder3,
            secondtitle4: req.body.secondtitle4,
            seconddescription4: req.body.seconddescription4,
            secondimage4: image41,
            secondorder4: req.body.secondorder4
        }

        items["thirdsection"]  = {
            visibility: req.body.thirdvisibility,
            thirdtitle: req.body.thirdtitle,
            thirddescription: req.body.thirddescription,
            thirdbtntext: req.body.thirdbtntext,
            thirdbtnlink: req.body.thirdbtnlink,
            thirdimage: myVal3,
            thirdorder: req.body.thirdorder,
            thirdtitle1: req.body.thirdtitle1,
            thirddescription1: req.body.thirddescription1,
            thirdbtntext1: req.body.thirdbtntext1,
            thirdbtnlink1: req.body.thirdbtnlink1,
            thirdorder1: req.body.thirdorder1,
            thirdcopyimage_1: optionsData.thirdcopyimage_1,
            thirdtitle2: req.body.thirdtitle2,
            thirddescription2: req.body.thirddescription2,
            thirdbtntext2: req.body.thirdbtntext2,
            thirdbtnlink2: req.body.thirdbtnlink2,
            thirdcopyimage_2: optionsData.thirdcopyimage_2,
            thirdorder2:  req.body.thirdorder2
  
        };

        items["fourthsection"] = {
            visibility: req.body.fourthvisibility,
            fourthtitle: req.body.fourthtitle,
            fourthauthor: req.body.fourthauthor,
            fourthdescription: req.body.fourthdescription,
            fourthtwitter: req.body.fourthtwitter,
            fourthinsta: req.body.fourthinsta,
            fourthfb: req.body.fourthfb,
            fourthorder: req.body.fourthorder,
            fourthimage: myVal
        };


      
        page.pagecontent      = items;
        let query = {_id:req.params.id}
        Page.findOneAndUpdate(query, page, function(err){
            if(err){
               res.status(404).json({ 'success': false, 'message': 'Error in Updating Page', errors: err });
            } else {
                res.status(200).json({ 'success': true, 'message': 'Page Updated'});
            }
        });
    } else if(req.body.layout == 'html'){
        let page               = {};
        page.title             = req.body.title.trim();
        page.layout            = 'html';
        page.pagetype          = req.body.pagetype;
        page.country           = req.body.country;
        page.pagecontent       = req.body.htmlcode;
        let query = {_id:req.params.id}
        Page.findOneAndUpdate(query, page, function(err){
            if(err){
               res.status(404).json({ 'success': false, 'message': 'Error in Updating Page', errors: err });
            } else {
                res.status(200).json({ 'success': true, 'message': 'Page Updated'});
            }
        });
    } else if(req.body.layout == 'layout2') {
        let optionsData = {};
        if(req.files) {
            filesArray.map( async (item, index)=> {
                let fieldname           = item.fieldname
                optionsData[fieldname]  = item.path;
            });
        }
        console.log(req.files)
        let fourthImageLink = req.body.fourthimagelink;
        if(fourthImageLink) {
            fourthImageLink.map( async (item, linkindex)=> {
                if(item == "") {
                    let key = 'fourthimage'+linkindex;
                    filesArray.map( async (item, fileindex)=> {
                        if(item.fieldname == key){
                            fourthImageLink[linkindex] = item.path; 
                        }
                    });  
                }
            });
        }

        if (optionsData.firstbgimage === undefined || optionsData.firstbgimage === null) {
            optionsData.firstbgimage = req.body.firstimagelink;
        }
        

        let iarray = Object.entries(optionsData);
        let final4array = [];
        let final4obj = {};
        let fourthi = iarray.map(function(el){
            var lastchar = el[0].substr(el[0].length - 1);
            let name = el[0].substring(0, el[0].length - 1);
            console.log({lastchar})
            console.log({name})
            if(name == "fourthimage"){
                
                final4obj[lastchar] = el[1];
                final4array.push(final4obj)
            }
        })
        Object.values(final4obj).map(function(el, index){
            final4 = replaceAt(fourthImageLink, el, final4obj[el])
        })
        const myVal = fourthImageLink.map((el, index) => {
            if(final4obj[index]){
                return final4obj[index]
            }
            return el
        })
        function replaceAt(array, index, value) {
            const ret = array.slice(0);
            ret[index] = value;
            return ret;
          }



        let page               = {};
        page.title             = req.body.title.trim();
        page.layout            = req.body.layout;
        page.pagetype          = req.body.pagetype;
        page.country           = req.body.country;
        let items              = {};

        items["firstsection"]  = {
            visibility: req.body.firstvisibility,
            title: req.body.firsttitle,
            description: req.body.firstdescription,
            btntext: req.body.firstbtntext,
            btnlink: req.body.firstbtnlink,
            firstbgimage: optionsData.firstbgimage
        }

        items["secondsection"] = {
            visibility: req.body.secondvisibility,
            secondtitle: req.body.secondtitle,
            secondsubtitle: req.body.secondsubtitle,
            seconddiseases: req.body.seconddiseases
        }

        items["thirdsection"]  = {
            visibility: req.body.thirdvisibility,
            thirdtitle: req.body.thirdstitle,
            thirdfirstdescription: req.body.thirdfirstdescription,
            thirddiseases: req.body.thirddiseases,
            thirdseconddescription: req.body.thirdseconddescription,
            thirdbtntext: req.body.thirdbtntext,
            thirdbtnlink: req.body.thirdbtnlink,
            thirdslinktext: req.body.thirdslinktext,
            thirdsbtnlink: req.body.thirdsbtnlink
        };

        items["fourthsection"] = {
            visibility: req.body.fourthvisibility,
            fourthtitle: req.body.fourthtitle,
            fourthlink: req.body.fourthlink,
            fourthimage: myVal
        };
        page.pagecontent       = items;
        let query = {_id:req.params.id}
        Page.findOneAndUpdate(query, page, function(err){
            if(err){
               res.status(404).json({ 'success': false, 'message': 'Error in Updating Page', errors: err });
            } else {
                res.status(200).json({ 'success': true, 'message': 'Page Updated'});
            }
        });
    } else {
        let optionsData = {};
        if(req.files) {
            filesArray.map( async (item, index)=> {
                let fieldname           = item.fieldname
                optionsData[fieldname]  = item.path;
            });
        }

        if(!optionsData.hasOwnProperty('firstimage')){
            optionsData.firstimage = req.body.firstimagelink;
        }

        if(!optionsData.hasOwnProperty('thirdimage')){
            optionsData.thirdimage = req.body.thirdimagelink;
        }

        if(!optionsData.hasOwnProperty('fourthimage')){
            optionsData.fourthimage = req.body.fourthimagelink;
        }

        if(!optionsData.hasOwnProperty('fifthimage')){
            optionsData.fifthimage = req.body.fifthimagelink;
        }


        let page               = {};
        page.title             = req.body.title.trim();
        page.layout            = req.body.layout;
        page.pagetype          = req.body.pagetype;
        page.country           = req.body.country;
        let items              = {};

        items["firstsection"]  = {title: req.body.firsttitle, description: req.body.firstdescription, visibility: req.body.firstvisibility, btntext: req.body.firstbtntext, btnlink: req.body.firstbtnlink, imagelink: optionsData.firstimage};

        items["secondsection"] = {title: req.body.secondtitle, description: req.body.seconddescription, visibility: req.body.secondvisibility, linktext: req.body.secondlinktext, btnlink: req.body.secondlink};

        items["thirdsection"]  = {stitle: req.body.thirdstitle, title: req.body.thirdtitle, description: req.body.thirddescription, visibility: req.body.thirdvisibility, btntext: req.body.thirdbtntext, btnlink: req.body.thirdbtnlink, imagelink: optionsData.thirdimage};

        items["fourthsection"] = {stitle: req.body.fourthstitle, title: req.body.fourthtitle, description: req.body.fourthdescription, visibility: req.body.fourthvisibility, btntext: req.body.fourthbtntext, btnlink: req.body.fourthbtnlink, imagelink: optionsData.fourthimage};

        items["fifthsection"]  = {stitle: req.body.fifthstitle, title: req.body.fifthtitle, description: req.body.fifthdescription, visibility: req.body.fifthvisibility, btntext: req.body.fifthbtntext, btnlink: req.body.fifthbtnlink, imagelink: optionsData.fifthimage};

        items["sixthsection"]  = {title: req.body.sixthtitle, description: req.body.sixthdescription, visibility: req.body.sixthsectionvisibility};

        page.pagecontent      = items;
        let query = {_id:req.params.id}
        Page.update(query, page, function(err){
            if(err){
                res.status(404).json({ 'success': false, 'message': 'Error in Updating Page', errors: err });
            } else {
                res.status(200).json({ 'success': true, 'message': 'Page Updated'});
            }
        });
    }
});





//old code 
// router.post('/edit/:id', upload.any(), async (req, res) => {
//     req.checkBody('title', 'Page Title is required').notEmpty();
//     req.checkBody('layout', 'Page Layout is required').notEmpty();
//     req.checkBody('country', 'Page Country is required').notEmpty();
//     let errors = req.validationErrors();
//     let filesArray = req.files;
//     if (errors) return res.status(404).json({ 'success': false, 'message': errors});
//     if(req.body.titlelayout1) {
//         let optionsData = {};
//         console.log(req.files);
//         let thirdImgArray = [];
//         let thirdindex = 0;
//         let fourthImgArray = [];
//         let fourthindex = 0;

//         if(req.files) {
//             filesArray.map( async (item, index)=> {
//                 if(item.fieldname == "thirdimage") {
//                     thirdImgArray[thirdindex] = item.location;
//                     thirdindex++;
//                 } else if(item.fieldname == "fourthimage") {
//                     fourthImgArray[fourthindex] = item.location;
//                     fourthindex++;
//                 } else {
//                     let fieldname           = item.fieldname
//                     optionsData[fieldname]  = item.location;     
//                 }
                
//             });
//         }

        
//         let thirdLink = req.body.thirdimagelink;
//         thirdLink.map( async (item, linkindex)=> {
//            if(item == "") {
//                let key = 'thirdimage'+linkindex;
//                filesArray.map( async (item, fileindex)=> {
//                    if(item.fieldname == key){
//                     thirdLink[linkindex] = item.location; 
//                    }
//                });  
//            }
//         });

//         let fourthLink = req.body.fourthimagelink;
//         fourthLink.map( async (item, linkindex)=> {
//            if(item == "") {
//                let key = 'fourthimage'+linkindex;
//                filesArray.map( async (item, fileindex)=> {
//                    if(item.fieldname == key){
//                     fourthLink[linkindex] = item.location; 
//                    }
//                });  
//            }
//         });
//         let page               = {};
//         page.title             = req.body.title;
//         page.layout            = 'layout1';
//         page.pagetype          = req.body.pagetype;
//         page.country           = req.body.country;
//         let items              = {};

    
//         if (optionsData.firstimage === undefined || optionsData.firstimage === null) {
//             optionsData.firstimage = req.body.firstimagelink;
//         }

//         if (optionsData.thirdimage1 === undefined || optionsData.thirdimage1 === null) {
//             optionsData.thirdimage1 = req.body.thirdimagelink1;
//         }

//         if (optionsData.thirdimage2 === undefined || optionsData.thirdimage2 === null) {
//             optionsData.thirdimage2 = req.body.thirdimagelink2;
//         }


//         items["firstsection"]  = {
//             visibility: req.body.firstvisibility,
//             title: req.body.firsttitle,
//             author: req.body.firstauthor,
//             date: req.body.firstdate,
//             description: req.body.firstdescription,
//             firstorder: req.body.firstorder,
//             firstimage: optionsData.firstimage
//         }

//         items["secondsection"] = {
//             visibility: req.body.secondvisibility,
//             secondtitle: req.body.secondtitle,
//             seconddescription: req.body.seconddescription,
//             secondorder: req.body.secondorder,
//             secondtitle1: req.body.secondtitle1,
//             seconddescription1: req.body.seconddescription1,
//             secondorder1: req.body.secondorder1,
//             secondtitle2: req.body.secondtitle2,
//             seconddescription2: req.body.seconddescription2,
//             secondorder2: req.body.secondorder2,
//             secondtitle3: req.body.secondtitle3,
//             seconddescription3: req.body.seconddescription3,
//             secondorder3: req.body.secondorder3,
//             secondtitle4: req.body.secondtitle4,
//             seconddescription4: req.body.seconddescription4,
//             secondorder4: req.body.secondorder4
//         }

//         items["thirdsection"]  = {
//             visibility: req.body.thirdvisibility,
//             thirdtitle: req.body.thirdtitle,
//             thirddescription: req.body.thirddescription,
//             thirdbtntext: req.body.thirdbtntext,
//             thirdbtnlink: req.body.thirdbtnlink,
//             thirdimage: thirdLink,
//             thirdorder: req.body.thirdorder,
//             thirdtitle1: req.body.thirdtitle1,
//             thirddescription1: req.body.thirddescription1,
//             thirdbtntext1: req.body.thirdbtntext1,
//             thirdbtnlink1: req.body.thirdbtnlink1,
//             thirdorder1: req.body.thirdorder1,
//             thirdimage1: optionsData.thirdimage1,
//             thirdtitle2: req.body.thirdtitle2,
//             thirddescription2: req.body.thirddescription2,
//             thirdbtntext2: req.body.thirdbtntext2,
//             thirdbtnlink2: req.body.thirdbtnlink2,
//             thirdimage2: optionsData.thirdimage2,
//             thirdorder2:  req.body.thirdorder2
  
//         };

//         items["fourthsection"] = {
//             visibility: req.body.fourthvisibility,
//             fourthtitle: req.body.fourthtitle,
//             fourthauthor: req.body.fourthauthor,
//             fourthdescription: req.body.fourthdescription,
//             fourthtwitter: req.body.fourthtwitter,
//             fourthinsta: req.body.fourthinsta,
//             fourthfb: req.body.fourthfb,
//             fourthorder: req.body.fourthorder,
//             fourthimage: fourthLink
//         };

//         page.pagecontent      = items;
//         let query = {_id:req.params.id}
//         Page.findOneAndUpdate(query, page, function(err){
//             if(err){
//                res.status(404).json({ 'success': false, 'message': 'Error in Updating Page', errors: err });
//             } else {
//                 res.status(200).json({ 'success': true, 'message': 'Page Updated'});
//             }
//         });
//     } else if(req.body.layout == 'html'){
//         let page               = {};
//         page.title             = req.body.title;
//         page.layout            = 'html';
//         page.pagetype          = req.body.pagetype;
//         page.country           = req.body.country;
//         page.pagecontent       = req.body.htmlcode;
//         let query = {_id:req.params.id}
//         Page.findOneAndUpdate(query, page, function(err){
//             if(err){
//                res.status(404).json({ 'success': false, 'message': 'Error in Updating Page', errors: err });
//             } else {
//                 res.status(200).json({ 'success': true, 'message': 'Page Updated'});
//             }
//         });
//     } else {
//         let optionsData = {};
//         if(req.files) {
//             filesArray.map( async (item, index)=> {
//                 let fieldname           = item.fieldname
//                 optionsData[fieldname]  = item.location;
//             });
//         }

//         if(!optionsData.hasOwnProperty('firstimage')){
//             optionsData.firstimage = req.body.firstimagelink;
//         }

//         if(!optionsData.hasOwnProperty('thirdimage')){
//             optionsData.thirdimage = req.body.thirdimagelink;
//         }

//         if(!optionsData.hasOwnProperty('fourthimage')){
//             optionsData.fourthimage = req.body.fourthimagelink;
//         }

//         if(!optionsData.hasOwnProperty('fifthimage')){
//             optionsData.fifthimage = req.body.fifthimagelink;
//         }


//         let page               = {};
//         page.title             = req.body.title;
//         page.layout            = req.body.layout;
//         page.pagetype          = req.body.pagetype;
//         page.country           = req.body.country;
//         let items              = {};

//         items["firstsection"]  = {title: req.body.firsttitle, description: req.body.firstdescription, visibility: req.body.firstvisibility, btntext: req.body.firstbtntext, btnlink: req.body.firstbtnlink, imagelink: optionsData.firstimage};

//         items["secondsection"] = {title: req.body.secondtitle, description: req.body.seconddescription, visibility: req.body.secondvisibility, linktext: req.body.secondlinktext, btnlink: req.body.secondlink};

//         items["thirdsection"]  = {stitle: req.body.thirdstitle, title: req.body.thirdtitle, description: req.body.thirddescription, visibility: req.body.thirdvisibility, btntext: req.body.thirdbtntext, btnlink: req.body.thirdbtnlink, imagelink: optionsData.thirdimage};

//         items["fourthsection"] = {stitle: req.body.fourthstitle, title: req.body.fourthtitle, description: req.body.fourthdescription, visibility: req.body.fourthvisibility, btntext: req.body.fourthbtntext, btnlink: req.body.fourthbtnlink, imagelink: optionsData.fourthimage};

//         items["fifthsection"]  = {stitle: req.body.fifthstitle, title: req.body.fifthtitle, description: req.body.fifthdescription, visibility: req.body.fifthvisibility, btntext: req.body.fifthbtntext, btnlink: req.body.fifthbtnlink, imagelink: optionsData.fifthimage};

//         items["sixthsection"]  = {title: req.body.sixthtitle, description: req.body.sixthdescription, visibility: req.body.sixthsectionvisibility};

//         page.pagecontent      = items;
//         let query = {_id:req.params.id}
//         Page.update(query, page, function(err){
//             if(err){
//                 res.status(404).json({ 'success': false, 'message': 'Error in Updating Page', errors: err });
//             } else {
//                 res.status(200).json({ 'success': true, 'message': 'Page Updated'});
//             }
//         });
//     }
// });



router.get('/pagecontent', async function (req, res) {    
    console.log(req.query)    
    Page.find({title: req.query.id}).then((data) => check(data)).catch((err) => ({status: false, error: err}));
    function check (data){
            if(data.length !== 0){
                res.json({status: true, content: data})
            }   
         else 
            {
               Page.find().then((data) => res.json({status: false, error: "country not found", content: data})).catch((err) => res.json({status: false, error: err}))              
            }            
        }})
//     } else {


//         Page.find().then((data) => check(data));
        
//     function check(data){
//         if(data.length >= 1){
//             Page.findOne({title: req.query.layout, pagetype:req.query.type, country: req.query.country}).then((page_content) => redirect(page_content))        
//     async function redirect(page_content){      
//         if(page_content == null){
//             if(req.query.type == "home"){
//                 let pageContent  = await Page.findOne({title: 'Home USA', pagetype:"home", country: 'United States'}).select('-1');
//                 res.json({ 'success': true, 'error': 'Country not found', 'content':pageContent });}
//                 else if(req.query.type == 'faq'){
//                     let pageContent  = await Page.findOne({title: 'Faq USA', pagetype:"faq", country: 'United States'}).select('-1');
//                     res.status(200).json({ 'success': true, 'error': 'Country not found', 'content': pageContent });
//                 } else if(req.query.type == "about"){
//                      let pageContent  = await Page.findOne({title: 'About USA', pagetype:"about", country: 'United States'}).select('-1');
//                     res.status(200).json({ 'success': true, 'error': 'Country not found', 'content': pageContent });
//                 } else if(req.query.type == "contact"){
//                      let pageContent  = await Page.findOne({title: 'Contact USA', pagetype:"contact", country: 'United States'}).select('-1');
//                     res.status(200).json({ 'success': true, 'error': 'Country not found', 'content': pageContent });
//                 }}
//         else {
//              await Page.findOne({title: req.query.layout, pagetype:req.query.type, country: req.query.country}).select('-1').sort({_id: 'asc'}).then((content) => test(content));
//             function test(content){
//                 if(content != null){
//                     res.status(200).json({ 'success': true, 'content': content });
//                 } else {
//                     res.status(404).json({success: false, 'content': "Page Not Found"});
//                 }}}}}
//     //  else {
//     //     res.json({'success': false, message: "No layouts found"  });
//     // }
// }}});

router.get('/delete/:id', ensureAuthenticated, function(req, res){
    let query = {_id:req.params.id}
    Page.findById(req.params.id, function(err, page){
        Page.remove(query, function(err){
          if(err){
            console.log(err);
          }
          res.redirect('/pages/all');
        });
    });
});


router.post("/update", function(req, res){
    console.log(req.body);
    let id = req.body.pageid;
    let continent = req.body.continent; 

    Page.findByIdAndUpdate(id, {$set:{continent}}, {new:true}).then((data) => res.status(200).json({status: true, data})).catch((err) => res.sttaus(400).json(err))
});
// router.get('/allpages',function (req, res) {
//     Page.find({}).sort({_id: 'desc'}).exec(function (err, pages) {
//     if(err) {
//         res.json({ 'success': false, 'message': err });
//     } else {
//         res.json({ 'success': true, 'pages': pages });
//     }
//   });
// });

// Access Control
function ensureAuthenticated(req, res, next) {
    if (req.user) {
        return next();
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect('/users/login');
    }
}

// //viewing order 
router.get("/orders/view/:id", ensureAuthenticated, async function(req, res){
    let query = req.params.id;
    OrderProduct.find({_id: query}).exec(function(err, orders){
        if(err){
            res.json({status: false, error: err})
        } else {
            let product = {};
            product = orders.orderproduct;
            res.status(200).render('view_order.hbs', {
                pageTitle: 'View Ordered Products',
                orders: orders,
            });    
        }
    });
});

// Route to get all orders
router.get('/orders/all', ensureAuthenticated, function (req, res) {
    OOrder.find({isDeleted: "false"}).sort({_id: 'desc'}).exec(function (err, orders) {
        if(err) {
            console.log(err);
        } else {
            res.render('all_orders.hbs', {
                pageTitle: 'All Orders',
                orders: orders 
            });
  
        }
    })
});

// // Route to get all the cancelled orders
router.get('/orders/cancelled/all', ensureAuthenticated, function (req, res) {
    OOrder.find({$or: [{deleted: "Cancelled By Admin"}, {deleted: "Cancelled By User"}]}).sort({_id: 'desc'}).exec(function (err, orders) {
        if(err) {
            console.log(err);
        } else {
            res.render('cancelled_orders.hbs', {
                pageTitle: 'Cancelled Orders',
                orders: orders 
            });
  
        }
    })
});

// //deeleting the order
router.get('/orders/delete/:id', async function(req, res) {
	let id = req.params.id;
	OrderProduct.findOneAndUpdate({ _id: id }, { $set: { deleted: "Cancelled By Admin" } })
		.then((data) => res.redirect("/pages/orders/all"))
		.catch((err) => ({ status: false, error: err }));
        
    });


// //revert back order
router.get('/orders/revert/:id', async function(req, res) {
	let id = req.params.id;
	OrderProduct.findOneAndUpdate({ _id: id }, { $set: { deleted: "false" } }, { new: true })
		.then((data) => res.redirect("/pages/orders/cancelled/all"))
		.catch((err) => ({ status: false, error: err }));
});

// //delete the order permanently 
router.get('/orders/permadelete/:id', async function(req, res) {
    let id = req.params.id;
//     var answer = confirm("Save data?")
// if (answer) {
    OrderProduct.findOneAndRemove({ _id: id })
		.then((data) => res.redirect("/pages/orders/cancelled/all"))
		.catch((err) => ({ status: false, error: err }));
}
	);



module.exports = router;