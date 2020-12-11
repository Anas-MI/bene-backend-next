const express       = require('express');
const router        = express.Router();
const path          = require('path');
const cloudinary    = require('cloudinary').v2;
const aws           = require('aws-sdk');
const bodyParser    = require('body-parser');
const multer        = require('multer');
const multerS3      = require('multer-s3');
const db            = require('../config/database');
const Product       = db.Product;
const ProductMeta   = db.ProductMeta;
const Category      = db.Category;
const Attribute     = db.Attribute;
const Review        = db.Review;
let Creatives = require("../models/creatives");
const Vendors = db.vendor;
const Ptype = db.packagetype;
const Barcodes = db.barcodes;
const Combos = db.combos;
aws.config.update({
    secretAccessKey: process.env.SECRETACCESSKEY,
    accessKeyId: process.env.ACCESSKEYID,
    region: process.env.REGION
});

const app = express();
const s3 = new aws.S3();

app.use(bodyParser.json());

// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, './public/images/uploads')
//     },
//     filename: (req, file, cb) => {
//       cb(null, file.fieldname + '-' +  Date.now() + path.extname(file.originalname))
//     }
// });


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/images/uploads')
    },
    filename: (req, file, cb) => {
        let filename = file.originalname.split(".")[0];
      cb(null, filename + '-' +  Date.now() + path.extname(file.originalname))
    }
});

// var pdfStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, './public/images/labsheets')
//     },
//     filename: (req, file, cb) => {
//         let filename = file.originalname.split(".")[0];
//       cb(null, filename + '-' +  Date.now() + path.extname(file.originalname))
//     }
// });

// var uploadPdf = multer({storage: pdfStorage,
//     fileFilter: function (req, file, callback) {
//         var ext = path.extname(file.originalname);
//         if(ext !== '.pdf' ) {
//             req.fileValidationError = "Forbidden extension - Not a PDF";
//             return callback(null, false, req.fileValidationError);
//         }
//         callback(null, true)
//     }});

var upload = multer({storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.pdf' &&  ext !== '.webp') {
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

const countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua","Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas"
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


//Creative link
router.post("/creatives/add", upload.any(), (req, res) => {
console.log(req.body)
console.log(req.files)
if(req.files){
let photo = {};
req.files.map( (item, index)=> {
        if(item.fieldname == 'image') {
            photo.featureimage = item.path;
        }})
let body = {...req.body, image:photo.featureimage}    
let creative = new Creatives(req.body)
	
    creative.save().then(() => res.redirect("/ambassador-portal/creatives"))
}});



// Product Add Get Route
router.get('/add-product', ensureAuthenticated, async function (req, res) {
    let products = await Product.find().select('-1').sort({_id: 'asc'});
    let categories = await Category.find().select('-1').sort({_id: 'asc'});
    let attributes = await Attribute.find().exec();
    let vendor = await Vendors.find();
    let barcodes = await Barcodes.find();
    let ptype = await Ptype.find();
    return res.status(200).render('add_product.hbs', {
        pageTitle: 'Add Products',
        products:products,
        categories:categories,
        attributes: attributes,
        countries: countries,
        vendor, 
        ptype
    });      
});

router.get("/combos/add", async function(req, res){
    // let productList = await ProductMeta.find({}).then((newRes) => console.log({newRes}))
    // console.log({productList})
    // res.render("add_combos.hbs", { productList })

    let productmeta = await ProductMeta.find().select('-1').sort({_id: 'desc'}).populate('productid').populate('categoryid');
    let products = await Product.find().select('-1').sort({_id: 'asc'});
    let categories = await Category.find().select('-1').sort({_id: 'asc'});
    let attributes = await Attribute.find().exec();
    let vendor = await Vendors.find();
    let barcodes = await Barcodes.find();
    let ptype = await Ptype.find();
    const productList = productmeta.map(el => ({
        title: el.productid.producttitle,
        _id: el._id,
        variation: el.variation
    }))
    return res.status(200).render('add_combos.hbs', {
        productList,
        products,
        categories,
        attributes,
        countries,
        vendor,
        ptype
    });
    // return res.status(200).json(productList);
});
router.post('/combos/add',upload.any(), async function(req, res){
    req.checkBody('producttitle', 'Title is required').notEmpty();
    // req.checkBody('categoryid', 'Product Category is required').notEmpty();
    req.checkBody('sku', 'Product Sku is required').notEmpty();
    let filesArray = req.files;
    let errors = req.validationErrors();
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
        return res.status(200).json({ 'success': false, 'message': 'Validation error', 'errors': errors });
    }
    let photo = {};
    let photob = {};
    let galleryArray = [];
    let galindex = 0;
    filesArray.map( (item, index)=> {
        if(item.fieldname == 'feature_image') {
            photo.featureimage = item.path;
        } else if(item.fieldname == 'sectionbimage') {
            photob.sectionbimage = item.path;
        } else if(item.fieldname == 'menu_image') {
            photob.menuimage = item.path;
        }  else if(item.fieldname == 'labsheet') {
            photob.labsheet = item.path;
        } else {
            galleryArray[galindex] = item.path;
            galindex++;
        }
    });



    if(req.fileValidationError) return res.status(200).json({ 'success': false, 'message': 'File Validation error', errors: req.fileValidationError });
    
    console.log(req.body)
    let  weight = 0, servings = 0, servingsize = 0, totalcbdmg = 0, cbdperunitmg = 0, length = 0, width = 0, height = 0;
    let addInternally =  req.body.select_product_combo.map(el => {
        ProductMeta.findById(el).then((data) => addthem(data))
        function addthem(data){
        console.log({"Add Them": data})
        weight = weight + data.weight;
        servings = servings + parseInt(data.servings);
        servingsize = servingsize + parseInt(data.servingsize);
        totalcbdmg = totalcbdmg + data.totalcbdmg;
        cbdperunitmg = cbdperunitmg + data.cbdperunitmg;
        length = length + data.shipping_length;
        if(width <= data.shipping_width){
            width = data.shipping_width
        }
        // width = width + data.shipping_width;
        if(height <= data.shipping_height){
            height = data.shipping_height
        }
        // height = height + data.shipping_height;
        console.log(weight)
    console.log(servings)
    console.log(servingsize)
    console.log(totalcbdmg)
    console.log(cbdperunitmg)
    console.log(length)
    console.log(width)
    console.log(height)
    }})

    setTimeout(function(){ 

        const comboProducts = Object.keys(req.body).map(el => {
            const simpleId = el.split("select_simple__")[1]
            const variationId = el.split("select_combo_variation__")[1]
            const combo_pid = simpleId || variationId
            const sku =	req.body[el]
    
            let isVariable = false
            if(variationId)
                isVariable = true
            
            if(combo_pid)
            return {combo_pid, sku, isVariable }
            
            return null
        }).filter(el => el)
        const combo1 = req.body["select-product-combo"]
    
        combo = new Combos();
        combo.title = req.body.producttitle,
        combo.sdescription = req.body.sdescription;
        combo.description = req.body.description;
        combo.blockedcountries = req.body.blockedcountries;
        combo.packagingtype = req.body.packagingtype;
        combo.vendorid = req.body.vendorid;
        combo.visibilitytype = req.body.hide;
        combo.barcode = req.body.barcode;
        combo.featured = req.body.featured;
        combo.keyingredients = req.body.keyingredients;
        combo.allingredients = req.body.allingredients;
        combo.attributecontent = req.body.page_attribute;
        combo.dregularprice = req.body.regular_price;
        combo.dsaleprice = req.body.sale_price;
        combo.faqcontent = req.body.faq;
        combo.managestockstatus = req.body.manage_stock;
        //combo.soldindividual = req.body.
        combo.unit = req.body.stock;
        combo.shipping_weight = weight;
        combo.shipping_length = length;
        combo.shipping_width =  width;
        combo.shipping_height = height;
        combo.stock_status = req.body._stock_status;
        combo.batch_no = req.body.batch_no;
        combo.expiry = req.body.expiry;
        combo.volume = req.body.volume;
        combo.weight = req.body.weight;
        combo.volumeunit = req.body.volume_unit;
        combo.enablereview = req.body.enable_review;
        combo.featureimage = photo.featureimage
        combo.galleryimgdetails = galleryArray;
        combo.sectionbimage = photob.sectionbimage;
        combo.menuimage = photob.menuimage;
        //combo.labsheet = photob.labsheet;
        combo.categoryid = req.body.categoryid;
        combo.products = comboProducts;
        combo.asin = req.body.asin;
        combo.use = req.body.use;
        combo.storage = req.body.storage;
        combo.warning = req.body.warning;
        combo.indication = req.body.indication;
        combo.direction = req.body.direction;
        combo.warranty = req.body.warranty;
        combo.totalcbdmg = totalcbdmg;
        combo.cbdperunitmg = cbdperunitmg; 
        combo.servings = servings;
        combo.servingsize = servingsize;
        combo.sku = req.body.sku;
    
        combo.save().then((combo) => res.redirect("/products/combos/all")).catch((error) => console.log({error}));

    

     }, 3000);
    // const {
    //     select_product_combo,
    // } = req.body
   
})
router.get('/combos/api/view/:id', async function(req, res){
    let comboProduct = await Combos.findById(req.params.id)
    return res.status(200).json(comboProduct)
})
router.get("/combos/edit/:id", async function(req, res){
    let comboProduct = await Combos.findById(req.params.id).select('-1').sort({_id: 'desc'})
    // let categories = await Category.find().select('-1').sort({_id: 'asc'});
    // let attributes = await Attribute.find().exec();
    let vendor = await Vendors.find();
    let ptype = await Ptype.find();
    // let variationCount = comboProduct.variation.length;
    // let productattribute = comboProduct.attributes;
    // let attributeselected = [];
    let valueselected = [];
    
    // productattribute.map( (item, index)=> {
    //     attributeselected[index] = item.names;
    // });
    // let newattribute = [];
    // attributes.map( (attributeitem, index)=> {
    //     productattribute.map( (productaitem, prindex)=> {
    //         if(productaitem.names == attributeitem.slug) {
    //             newattribute[prindex] = attributeitem;
    //         }
    //     });
    // });
    return res.status(200).render('edit_combos.hbs', {
        pageTitle: 'Edit Products',
        products: comboProduct,
        // attributeselected: attributeselected,
        // newattribute: newattribute,
        // variationcount: variationCount,
        // categories:categories,
        // attributes: attributes,
        countries: countries,
        vendor,
        ptype
    });  
})

router.post("/combos/edit/:id", upload.any(), async function(req, res){
    let id = req.params.id;
    let combo_data = await Combos.findById(id)
    let filesArray = req.files;
    let tempArr = [];
    let errors = req.validationErrors();
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
        res.json({ 'success': false, 'message': 'Validation error', 'errors': errors });
    } else {
        let galleryArray = [];
        let photo = {};
        let photob = {};
        if(req.files) {
            let galindex = 0;
            filesArray.map( (item, index)=> {
                if(item.fieldname == 'feature_image') {
                    photo.featureimage = item.path;
                } else  if(item.fieldname == 'sectionbimage') {
                    photob.sectionbimage = item.path;
                } else  if(item.fieldname == 'menu_image') {
                    photob.menuimage = item.path;
                } else {
                    galleryArray[galindex] = item.path;
                    galindex++;
                }
            });
        }

    // console.log(req.files);
     console.log({galleryArray})
     let  weight = 0, servings = 0, servingsize = 0, totalcbdmg = 0, cbdperunitmg = 0, length = 0, width = 0, height = 0;
     let addInternally =  req.body.select_product_combo.map(el => {
         ProductMeta.findById(el).then((data) => addthem(data))
         function addthem(data){
         console.log({"Add Them": data})
         weight = weight + data.weight;
         servings = servings + parseInt(data.servings);
         servingsize = servingsize + parseInt(data.servingsize);
         totalcbdmg = totalcbdmg + data.totalcbdmg;
         cbdperunitmg = cbdperunitmg + data.cbdperunitmg;
         length = length + data.shipping_length;
         width = width + data.shipping_width;
         height = height + data.shipping_height;
         console.log(weight)
     console.log(servings)
     console.log(servingsize)
     console.log(totalcbdmg)
     console.log(cbdperunitmg)
     console.log(length)
     console.log(width)
     console.log(height)
 
  
 
     }})
 
     setTimeout(function(){ 
 

    //     console.log(changeGallery)
    const comboProducts = Object.keys(req.body).map(el => {
        const simpleId = el.split("select_simple__")[1]
        const variationId = el.split("select_combo_variation__")[1]
        const combo_pid = simpleId || variationId
        const sku =	req.body[el]

        let isVariable = false
        if(variationId)
            isVariable = true
        
        if(combo_pid)
        return {combo_pid, sku, isVariable }
        
        return null
    }).filter(el => el)

    combo = {};
    combo.title = req.body.producttitle,
	combo.sdescription = req.body.sdescription;
	combo.description = req.body.description;
	combo.blockedcountries = req.body.blockedcountries;
	combo.packagingtype = req.body.packagingtype;
	combo.vendorid = req.body.vendorid;
	combo.visibilitytype = req.body.hide;
	combo.barcode = req.body.barcode;
	combo.featured = req.body.featured;
	combo.keyingredients = req.body.keyingredients;
	combo.allingredients = req.body.allingredients;
	combo.attributecontent = req.body.page_attribute;
	combo.dregularprice = req.body.regular_price;
	combo.dsaleprice = req.body.sale_price;
	combo.faqcontent = req.body.faq;
	combo.managestockstatus = req.body.manage_stock;
    //combo.soldindividual = req.body.
	combo.unit = req.body.stock;
	combo.shipping_weight = weight;
	combo.shipping_length = length;
	combo.shipping_width = width;
	combo.shipping_height = req.body._height;
	combo.stock_status = req.body._stock_status;
	combo.batch_no = req.body.batch_no;
	combo.expiry = req.body.expiry;
	combo.volume = req.body.volume;
	combo.weight = weight;
	combo.volumeunit = req.body.volume_unit;
    combo.enablereview = req.body.enable_review;
    if(photob.menuimage){
        combo.menuimage = photob.menuimage
    }
    
    if(photo.featureimage){
    combo.featureimage = photo.featureimage}
   

    if(combo_data.galleryimgdetails.length >= 1){
    let newArray = [];
    
    const changeGallery = galleryArray.map((el, index) => { 
        let elem = el.split("/")
        let elemMatch = elem[3].charAt(20)
        
        return {
            elemMatch,
            el
        }

    })
    const newArr = combo_data.galleryimgdetails.map((el ,index)=> {
        const matchedEl = changeGallery.find(elx => elx.elemMatch === index)
        

        if(matchedEl){
            return matchedEl.el
        }
        return el
    })
        
    var newEl  = combo_data.galleryimgdetails.map((el, index)=> {
    const mat = changeGallery.find((elN)=> {
      return elN.elemMatch === index.toString()
    })
    if(mat)
      return mat.el

    return el
    })
    console.log({newEl})

    // console.log(combo_data.galleryimgdetails)
    console.log({
        newEl,
        old: combo_data.galleryimgdetails
    })

    // Object.assign([], combo_data.galleryimgdetails, {el2: el});

    if(typeof req.files !== 'undefined' && req.files.length > 0) {
    
           
            //combo.galleryimgdetails = newEl;
            
	let sortArray = newEl.concat(galleryArray);
	let numArray = sortArray.map((el, index) => {
console.log({"insidesortaray": el})
    if(el){	
        let elem = el.split("/")
        let elemMatch = elem[3].charAt(20)
        console.log({elemMatch});
        console.log({index})
        console.log("value",  {el,"type": typeof el})
        if(elemMatch == index){
             
                
                return el ;
            	
        }
    }else{
        console.log("value not",  {el,"type": typeof el})
    }
	})
console.log({numArray});
numArray = numArray.filter(function( element ) {
   return element !== undefined;
});
combo.galleryimgdetails = numArray;
		
          console.log(combo.galleryimgdetails);
          console.log({"inside":galleryArray})
    }} else if(combo_data.galleryimgdetails.length === 0){
combo.galleryimgdetails = galleryArray;
}
   
    // if(galleryArray){
    // combo.galleryimgdetails = galleryArray;}
    if(photob.sectionbimage){
	combo.sectionbimage = photob.sectionbimage;}
	combo.categoryid = req.body.categoryid;
	combo.products = comboProducts;
	combo.asin = req.body.asin;
	combo.use = req.body.use;
	combo.storage = req.body.storage;
	combo.warning = req.body.warning;
	combo.indication = req.body.indication;
	combo.direction = req.body.direction;
	combo.warranty = req.body.warranty;
    combo.totalcbdmg = totalcbdmg;
    console.log({totalcbdmg});
	combo.cbdperunitmg = cbdperunitmg; 
	combo.servings = servings;
	combo.servingsize = servingsize;
    combo.sku = req.body.sku;
    console.log({combo});
    Combos.findOneAndUpdate({_id: id}, combo).then((combo) => res.redirect("/products/combos/all")).catch((err) => console.log(err));
    }, 3000); 
}})



// Product Add Post Route 
router.post('/add-product', upload.any(), async (req, res, next) => {
    console.log(req.files);
    console.log(req.body);
    req.checkBody('producttitle', 'Title is required').notEmpty();
    req.checkBody('categoryid', 'Product Category is required').notEmpty();
    req.checkBody('producttype', 'Product Type is required').notEmpty();
    req.checkBody('sku', 'Product Sku is required').notEmpty();
    let filesArray = req.files;
    let errors = req.validationErrors();
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
        return res.status(200).json({ 'success': false, 'message': 'Validation error', 'errors': errors });
    }
    let photo = {};
    let photob = {};
    let galleryArray = [];
    let galindex = 0;
    filesArray.map( (item, index)=> {
        if(item.fieldname == 'feature_image') {
            photo.featureimage = item.path;
        } else if(item.fieldname == 'menu_image') {
            photo.menuimage = item.path;
        } else if(item.fieldname == 'sectionbimage') {
            photob.sectionbimage = item.path;
        } if(item.fieldname == 'labsheet') {
            photob.labsheet = item.path;
        } else {
            galleryArray[galindex] = item.path;
            galindex++;
        }
    });



    if(req.fileValidationError) return res.status(200).json({ 'success': false, 'message': 'File Validation error', errors: req.fileValidationError });
    let productExist = await Product.findOne({sku: req.body.sku}).select('-1').sort({_id: 'asc'});
    const productLs = await Product.find()
    const productMLs = await ProductMeta.find()
    const p1 = productMLs.map(el => el.variation).map(el => el)
    const skuList = [
        ...productLs.map(el => el.sku),
        ...[].concat.apply([], [].concat.apply([], p1)).map(el => el.sku)
    ]
    
    if(req.body.producttype === "variable"){
    const variationArr = req.body.variaton_atttribute.filter(Boolean)
    const variationSkuArr = variationArr.map(el => el.sku)

    const currentSku = req.body.sku;
    
    var ccFlag = [...variationSkuArr, currentSku].some(el => skuList.includes(el))
    // console.log({
    //     variationSkuArr,
    //     currentSku,
    //     skuList,
    //     ccFlag
    // })
}

    let product = new Product();
    if(productExist || ccFlag) {
        return res.status(200).json({ 'success': false, 'serialerror': 'Duplicate Product Sku'});
    } else {
        function saveAttributes(array){
            const returnVal = array.map((el)=>{
                return {
                    ...el,
                    values: el.values.constructor === Array ?  [...el.values] : [el.values]
                }
            })

            return returnVal;
        }
        let skuval = 
        product.producttitle            = req.body.producttitle;
        product.sku                     = req.body.sku;
        product.description      = req.body.description;
        product.sdescription      = req.body.sdescription;
        product.featurefilepath         = photo.featureimage;
        product.menuimage = photo.menuimage;
        product.blockedcountries        = req.body.blockedcountries;
        product.save().then((product) => product_service(product)).catch((err) => res.status(200).json({'success': false, 'message': "error in getting result", 'error': err}));
        function product_service(product){
            if(product){
                let productMeta                     = new ProductMeta();
                productMeta.producttype             = req.body.producttype;
                productMeta.packagingtype           = req.body.packagingtype;
                productMeta.vendorid                = req.body.vendorid;
                productMeta.fieldname               = req.body.fieldname;
                productMeta.fieldvalue = req.body.fieldvalue;
                productMeta.keyingredients          = req.body.keyingredients;
                productMeta.labsheet = photob.labsheet;
                productMeta.allingredients          = req.body.allingredients;
                if(req.body.manage_stock) {
                    productMeta.managestockstatus   = req.body.manage_stock;
                    productMeta.unit                = req.body.stock;
                };
                if(req.body.enable_review) {
                    productMeta.enablereview        = req.body.enable_review;
                }
                productMeta.featured                = req.body.featured;
                productMeta.barcode                 = req.body.barcode;
                productMeta.visibilitytype          = req.body.hide;
                productMeta.asin                    = req.body.asin;
                productMeta.use                     = req.body.use;
                productMeta.weight                  = req.body.weight;
                productMeta.storage                 = req.body.storage;
                productMeta.warning                 = req.body.warning;
                productMeta.servings                = req.body.servings;
                productMeta.servingsize             = req.body.servingsize;
                productMeta.indication              = req.body.indication;
                productMeta.direction               = req.body.direction;
                productMeta.warranty                = req.body.warranty;
                productMeta.totalcbdmg              = req.body.totalcbdmg;
                productMeta.cbdperunitmg            = req.body.cbdperunitmg;
                productMeta.dsaleprice              = req.body.sale_price;
                productMeta.dregularprice           = req.body.regular_price;
                productMeta.productid               = product._id;
                productMeta.galleryimgdetails       = galleryArray;
                productMeta.sectionbimage           = photob.sectionbimage;
                if(req.body.page_attribute){
                productMeta.attributecontent        = req.body.page_attribute;}
                productMeta.faqcontent              = req.body.faq;
                if(req.body.producttype === "variable"){
                let variatonAtttribute              = req.body.attribute;
                variatonAtttribute                  = variatonAtttribute.filter(Boolean);
                productMeta.attributes              = saveAttributes(variatonAtttribute);}
                productMeta.categoryid              = req.body.categoryid;
                if(req.body.producttype === "variable"){
                let removeNullVariation             = req.body.variaton_atttribute;
                productMeta.variation               = removeNullVariation.filter(Boolean);}
                if(req.body._weight){
                productMeta.shipping_weight         = req.body._weight;}
                if(req.body.batch_no){
                    productMeta.batch_no         = req.body.batch_no;
                }
                if(req.body.expiry){
                    productMeta.expiry               = req.body.expiry;
                }
                if(req.body._length){
                    productMeta.shipping_length      = req.body._length;
                }
                if(req.body._width){
                    productMeta.shipping_width       = req.body._width;
                }
                if(req.body._height){
                    productMeta.shipping_height      = req.body._height;
                }
                if(req.body.volume){
                    productMeta.volume               = req.body.volume;
                    productMeta.volumeunit           = req.body.volume_unit;
                }

               
                if(req.body.product_shipping_class){
                productMeta.shipping_class          = req.body.product_shipping_class;}
                if(req.body._stock_status){
                    productMeta.stock_status            = req.body._stock_status;
                };
            
                productMeta.save().then((productmeta) => res.status(200).json({'success': true, 'message': "Product Saved Successfully", 'productmeta': productmeta, 'product': product})).catch((err) => res.status(200).json({'success': false, 'message': "error in Saving Product", 'error': err}));

            } else {
                res.status(200).json({'success': false, 'message': "error in Saving Product"});
            }
        
        }
    }
});
async function returnSku(){
    const productLs = await Product.find()
    const productMLs = await ProductMeta.find()
    const p1 = productMLs.map(el => el.variation).map(el => el)
    const skuList = [
        ...productLs.map(el => el.sku),
        ...[].concat.apply([], [].concat.apply([], p1)).map(el => el.sku)
    ]
    return skuList
}

router.get("/test", async function(req, res){

    const productLs = await Product.find()
    const productMLs = await ProductMeta.find()
    const p1 = productMLs.map(el => el.variation).map(el => el)
    const skuList = [
        ...productLs.map(el => el.sku),
        ...[].concat.apply([], [].concat.apply([], p1)).map(el => el.sku)
    ]
    console.log({skuList})
    res.status(200).json(skuList)
})
// Product Edit Get Route
router.get('/edit/:id', async function(req, res){
    let productmeta = await ProductMeta.findById(req.params.id).select('-1').sort({_id: 'desc'}).populate('productid').populate('categoryid').populate('vendorid').populate('packagingtype');
    let categories = await Category.find().select('-1').sort({_id: 'asc'});
    let attributes = await Attribute.find().exec();
    let vendor = await Vendors.find();
    let ptype = await Ptype.find();
    let variationCount = productmeta.variation.length;
    let productattribute = productmeta.attributes;
    let attributeselected = [];
    let valueselected = [];
    productattribute.map( (item, index)=> {
        attributeselected[index] = item.names;
    });

    let newattribute = [];
    attributes.map( (attributeitem, index)=> {
        productattribute.map( (productaitem, prindex)=> {
            if(productaitem.names == attributeitem.slug) {
                newattribute[prindex] = attributeitem;
            }
        });
    });


    return res.status(200).render('edit_product.hbs', {
        pageTitle: 'Edit Products',
        products: productmeta,
        attributeselected: attributeselected,
        newattribute: newattribute,
        variationcount: variationCount,
        categories:categories,
        attributes: attributes,
        countries: countries,
        vendor,
        ptype
    });  
});





// Product Edit Post Route
router.post('/edit/:id', upload.any(), async function(req, res){
  //  let productmeta = await ProductMeta.findById(req.params.id).select('-1').sort({_id: 'desc'}).populate('productid').populate('categoryid').populate('vendorid').populate('packagingtype');
  console.log(req.body) 
  let filesArray = req.files;
    let tempArr = [];
    req.checkBody('producttitle', 'Title is required').notEmpty();
    req.checkBody('categoryid', 'Product Category is required').notEmpty();
    req.checkBody('producttype', 'Product Type is required').notEmpty();
    req.checkBody('sku', 'Product Sku is required').notEmpty();
    let errors = req.validationErrors();
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
        res.json({ 'success': false, 'message': 'Validation error', 'errors': errors });
    } else {
        let galleryArray = [];
        let photo = {};
        let photob = {};
        if(req.files) {
            let galindex = 0;
            filesArray.map( (item, index)=> {
                if(item.fieldname == 'feature_image') {
                    photo.featureimage = item.path;
                } else if(item.fieldname == 'menu_image') {
                    photo.menuimage = item.path;
                } else  if(item.fieldname == 'sectionbimage') {
                    photob.sectionbimage = item.path;
                } else  if(item.fieldname == 'labsheet') {
                    photob.labsheet = item.path;
                } else {
                    galleryArray[galindex] = item.path;
                    galindex++;
                }
            });
        }
        

        function saveAttributes(array){
            const returnVal = array.map((el)=>{
                return {
                    ...el,
                    values: el.values.constructor === Array ?  [...el.values] : [el.values]
                }
            })
            return returnVal;
        }

        let productmeta_data = await ProductMeta.findById(req.params.id);
        let categoryid = productmeta_data.categoryid;
        let productid = productmeta_data.productid;

        let productMeta = {};
        productMeta.producttype             = req.body.producttype;
        productMeta.keyingredients          = req.body.keyingredients;
        productMeta.allingredients          = req.body.allingredients;
        productMeta.producttype              = req.body.producttype;
        productMeta.fieldname               = req.body.fieldname;
                productMeta.fieldvalue = req.body.fieldvalue;
        productMeta.visibilitytype            = req.body.visibilitytype;
        productMeta.featured                     = req.body.featured;
        productMeta.packagingtype               = req.body.packagetype;
        productMeta.vendorid                   = req.body.vendorid;
        productMeta.asin                    = req.body.asin;
                productMeta.use                     = req.body.use;
                productMeta.weight                  = req.body.weight;
                productMeta.storage                 = req.body.storage;
                productMeta.warning                 = req.body.warning;
                productMeta.servings                = req.body.servings;
                productMeta.servingsize             = req.body.servingsize;
                productMeta.indication              = req.body.indication;
                productMeta.direction               = req.body.direction;
                productMeta.warranty                = req.body.warranty;
                productMeta.totalcbdmg              = req.body.totalcbdmg;
                productMeta.cbdperunitmg            = req.body.cbdperunitmg;
                if(photob.labsheet){
                    if(photob.labsheet.length > 0){
                productMeta.labsheet           = photob.labsheet;}}
                if(photob.sectionbimage){
                    if(photob.sectionbimage.length > 0){
                productMeta.sectionbimage           = photob.sectionbimage;}}
                if(req.body.manage_stock) {
            productMeta.managestockstatus   = req.body.manage_stock;
            productMeta.unit                = req.body.stock;
        }
        if(req.body.enable_review) {
            productMeta.enablereview        = req.body.enable_review;
        }

        if(typeof req.files !== 'undefined' && req.files.length > 0) {
            if(galleryArray.length > 0){
               
                console.log("in galleryimg");
                console.log({galleryArray});
                productMeta.galleryimgdetails = productmeta_data.galleryimgdetails.concat(galleryArray);
                console.log(productMeta.galleryimgdetails)
            }
        }
        let variatonAtttribute 
        productMeta.attributecontent        = req.body.page_attribute;
        productMeta.faqcontent              = req.body.faq;
        if(req.body.producttype == "variable"){
         variatonAtttribute              = req.body.attribute;}
        productMeta.dsaleprice              = req.body.sale_price;
        productMeta.dregularprice           = req.body.regular_price;
        if(req.body.producttype == "variable"){
        variatonAtttribute                  = variatonAtttribute.filter(Boolean);
        productMeta.attributes              = saveAttributes(variatonAtttribute);}
        productMeta.categoryid              = req.body.categoryid;
        if(req.body.producttype == "variable"){
        let removeNullVariation             = req.body.variaton_atttribute;
        productMeta.variation               = removeNullVariation.filter(Boolean);}
        productMeta.barcode                 = req.body.barcode;
        if(req.body._stock_status){
            productMeta.stock_status        = req.body._stock_status;
        };

        if(req.body.batch_no){
            productMeta.batch_no         = req.body.batch_no;
        }
        if(req.body.expiry){
            productMeta.expiry               = req.body.expiry;
        }
        if(req.body._length){
            productMeta.shipping_length      = req.body._length;
        }
        if(req.body._width){
            productMeta.shipping_width       = req.body._width;
        }
        if(req.body._height){
            productMeta.shipping_height      = req.body._height;
        }
        if(req.body.volume){
            productMeta.volume               = req.body.volume;
            productMeta.volumeunit           = req.body.volume_unit;
        }

        
        console.log({productmeta: productMeta})
        ProductMeta.findOneAndUpdate({_id: req.params.id}, productMeta).then().catch((err) => console.log(err));

        // saving the data in product 

        let product = {}
        product.producttitle            = req.body.producttitle;
        product.sku                     = req.body.sku;
        product.description      = req.body.description;
        product.sdescription      = req.body.sdescription;
        product.id                      = req.body.productid;
        if(photo.featureimage){
        product.featurefilepath         = photo.featureimage;
        }
        if(photo.menuimage){
        product.menuimage =  photo.menuimage;}
        product.blockedcountries        = req.body.blockedcountries;
        Product.findOneAndUpdate({_id: productid}, product).then((product) => res.status(200).json({'success': true, 'message': "Product Saved Successfully", 'product': product})).catch((err) => console.log(err));
        }
});
            
// All Product show Route
router.get('/all', ensureAuthenticated, async function (req, res) {
    let productmeta = await ProductMeta.find().select('-1').sort({_id: 'desc'}).populate('productid').populate('categoryid');
    return res.status(200).render('allprodct.hbs', {
        pageTitle: 'All Products',
        products:productmeta
    });
});

// All combos show Route
router.get('/combos/all', ensureAuthenticated, async function (req, res) {
    let combo = await Combos.find().select('-1').sort({_id: 'desc'}).populate('categoryid');
    return res.status(200).render('allcombos.hbs', {
        pageTitle: 'All Combos',
        products:combo
    });
});

//All products show route for frontend 
//NOTE: ADD ENSURE AUTHENTICATED IN THIS ROUTE
router.get('/api/all', async function (req, res) {
    let productmeta = await ProductMeta.find().select('-1').sort({_id: 'desc'}).populate('productid').populate('categoryid');
   // res.setHeader('Cache-Control', 'Vary: Accept-Encoding Header, max-age=31557600');
    res.status(200).json({products: productmeta});
});


//Route to show all the products by their category 
router.post('/api/bycategory', async function(req, res){
    await Category.find({categorytitle: req.body.title}).then((data) => displayData(data))
    async function displayData(data){
        let id = data[0]._id;
         await ProductMeta.find({categoryid: id}).select('-1').sort({_id: '-1'}).populate('productid').populate('çategoryid').then((data) =>  res.status(200).json({success: true, products: data}));
    }
});


router.get('/api/combos/all', (req, res) => {
    Combos.find().populate("categoryid").then((data) => {
//res.setHeader('Cache-Control', 'Vary: Accept-Encoding Header, max-age=31557600'); 
res.status(200).json({success: true, combos: data })}).catch((err) => res.status(400).json({status: false, error: err}))
})

//combo remove feature image 
router.post('/combos/removeimage', upload.any(), async function(req, res){
    console.log(req.body);
    if(req.body.action == 'f_remove_combo') {
        let combo = {};
        combo.featureimage = '';
        let query = {_id:req.body.productid}
        Combos.update(query, combo, function(err){
            if(err){
                res.json({ 'success': false, 'message': 'Error in Removing Image', errors: err });
            } else {
                res.json({ 'success': true, 'message': 'Image Removed Successfully'});
            }
        });
    } else if(req.body.action == 'menu_remove') {
        let combo = {};
        combo.menuimage = '';
        let query = {_id:req.body.productid}
        Combos.update(query, combo, function(err){
            if(err){
                res.json({ 'success': false, 'message': 'Error in Removing Image', errors: err });
            } else {
                res.json({ 'success': true, 'message': 'Image Removed Successfully'});
            }
        });
    } else {
        let combos = await Combos.findById(req.body.productid);
        let galleryimgdetails = combos.galleryimgdetails;
        let imageIndex = req.body.imagetoremove;
        let newArray = [];
        galleryimgdetails.map( (item, index)=> {
            if(index != imageIndex) {
                newArray[index] =  item;
            }
        });

        let galleryArray = newArray.filter(Boolean);
        let combo = {};
        combo.galleryimgdetails = galleryArray;
        let query = {_id:req.body.productid}
        Combos.update(query, combo, function(err){
            if(err){
                res.json({ 'success': false, 'message': 'Error in Removing Image', errors: err });
            } else {
                res.json({ 'success': true, 'message': 'Image Removed Successfully'});
            }
        });
    }
});

router.post('/removeimage', upload.any(), async function(req, res){
    if(req.body.action == 'f_remove') {
        let product = {};
        product.featurefilepath = '';
        let query = {_id:req.body.productid}
        Product.update(query, product, function(err){
            if(err){
                res.json({ 'success': false, 'message': 'Error in Removing Image', errors: err });
            } else {
                res.json({ 'success': true, 'message': 'Image Removed Successfully'});
            }
        });
    } else  if(req.body.action == 'menu_remove') {
        let product = {};
        product.menuimage = '';
        let query = {_id:req.body.productid}
        Product.update(query, product, function(err){
            if(err){
                res.json({ 'success': false, 'message': 'Error in Removing Image', errors: err });
            } else {
                res.json({ 'success': true, 'message': 'Image Removed Successfully'});
            }
        });
    } else {
        let productmeta_data = await ProductMeta.findById(req.body.productid);
        let galleryimgdetails = productmeta_data.galleryimgdetails;
        let imageIndex = req.body.imagetoremove;
        let newArray = [];
        galleryimgdetails.map( (item, index)=> {
            if(index != imageIndex) {
                newArray[index] =  item;
            }
        });

        let galleryArray = newArray.filter(Boolean);
        let productmeta = {};
        productmeta.galleryimgdetails = galleryArray;
        let query = {_id:req.body.productid}
        ProductMeta.update(query, productmeta, function(err){
            if(err){
                res.json({ 'success': false, 'message': 'Error in Removing Image', errors: err });
            } else {
                res.json({ 'success': true, 'message': 'Image Removed Successfully'});
            }
        });
    }
});



router.post('/removebimage', upload.any(), async function(req, res){
    console.log({body: req.body});
        let productMeta = {};
        productMeta.sectionbimage = '';
        let query = {_id:req.body.productid}
        ProductMeta.findOneAndUpdate(query, productMeta, function(err){
            if(err){
                res.json({ 'success': false, 'message': 'Error in Removing Image', errors: err });
            } else {
                res.json({ 'success': true, 'message': 'Image Removed Successfully'});
            }
        });
});

//Route to remove section B image for combos
router.post('/combos/removebimage', upload.any(), async function(req, res){
    console.log({body: req.body});
        let combo = {};
        combo.sectionbimage = '';
        let query = {_id:req.body.productid}
        Combos.findOneAndUpdate(query, combo, function(err){
            if(err){
                res.json({ 'success': false, 'message': 'Error in Removing Image', errors: err });
            } else {
                res.json({ 'success': true, 'message': 'Image Removed Successfully'});
            }
        });
});

//Route to remove section B labsheet
router.post('/combos/removelabsheet', upload.any(), async function(req, res){
    console.log({body: req.body});
        let combo = {};
        combo.labsheet = '';
        let query = {_id:req.body.productid}
        ProductMeta.findOneAndUpdate(query, combo, function(err){
            if(err){
                res.json({ 'success': false, 'message': 'Error in Removing Image', errors: err });
            } else {
                res.json({ 'success': true, 'message': 'Image Removed Successfully'});
            }
        });
});


// Product Delete Route
router.delete('/delete/:id', async function(req, res){
    let query = {_id:req.params.id}
    let productmeta = await ProductMeta.findById(req.params.id).populate('productid');
    let productid =  productmeta.productid;
    console.log(productid);
    ProductMeta.findById(req.params.id, function(err, product){
        ProductMeta.remove(query, function(err){
            if(err){
                console.log(err);
            }
            Product.findById(productid, function(err, product){
                Product.remove(productid, function(err){
                    if(err){
                        console.log(err);
                    }
                    Review.find({productid: productid}, function(err, reveiws){
                        let reviewquery = {_id:reveiws._id}
                        Review.remove(reviewquery, function(err){
                            if(err){
                                console.log(err);
                            }
                            res.send('Success');
                        });
                    });
                });
            });
        });
    });
});

// All Attribute Show Route
router.get('/product-attribute', ensureAuthenticated, async function (req, res) {
    let attributes = await Attribute.find().exec();
    let termsobject  = attributes.terms;
    res.render('product_attribute.hbs', {
        pageTitle: 'Products Attribute',
        attributes: attributes,
        keys: termsobject
    });
});

// Add Attribute Main Route
router.post('/add-attribute', async (req, res) => {
    req.checkBody('attributetitle', 'Attribute Name is required').notEmpty();
    let errors = req.validationErrors();
    if (errors) return res.status(404).json({success: false, message: 'Validation Error', errors: errors});
    let nameCheck = await Attribute.findOne({name: req.body.attributetitle}).exec();
    if(nameCheck) return res.status(404).json({success: false, message: 'Name Already Exist Please Use Different Name'});
    let name                    = req.body.attributetitle;
    let lowerCaseName           = name.toLowerCase()
    let withoutSpaceName        = lowerCaseName.trim();
    let slug;
    if(req.body.attributeslug) {
        slug                    = req.body.attributeslug;
    } else {
        slug                    = withoutSpaceName.replace(/\s+/g, '-');
    }
    let attribute               = new Attribute();
    attribute.name              = name;
    attribute.slug              = slug;
    let attributeSave           = await attribute.save();
    if(attributeSave) {
        res.status(200).json({'success':true, 'message':"Attribute Added successfully", 'test':attributeSave});
    } else {
        res.status(200).json({'success':false, 'message':"Error in Saving the Attribute", 'test':attributeSave});
    }
});

// Attribute details Fetch Get Route 
router.get('/attribute-data/:id', ensureAuthenticated, function(req, res){
    Attribute.findById(req.params.id).then((result) => attributedata(result)).catch((err) => res.status(404).json({success: false, message: "error in getting result"}));
    function attributedata(result){
        if(result){
            res.status(200).json({'success':true, 'message':"Attribute fetch successfully", 'attributes':result});
        } else {
            res.status(404).json({success: false, message: "error in getting result"});
        }
    }   
});

//Attribute Edit Post Route
router.post('/attribute-data/:id', upload.any(), async (req, res) => {
    req.checkBody('attributetitle', 'Attribute Name is required').notEmpty();
    let errors = req.validationErrors();
    if (errors) return res.status(404).json({success: false, message: 'Validation Error', errors: errors});
    let name                    = req.body.attributetitle;
    let slug;
    let attribute               = {};
    attribute.name              = name;
    if(req.body.attributeslug) {
        slug                    = req.body.attributeslug;
        attribute.slug              = slug;
    }
    let query = {_id:req.params.id}
    Attribute.update(query, attribute, function(err){
        if(err){
            res.json({ 'success': false, 'message': 'Error in Updating Attribute', errors: err });
        } else {
            res.json({ 'success': true, 'message': 'Attribute Updated'});
        }
    });
});

// Attribute Delete Route
router.delete('/attribute-delete/:id', async function(req, res){
    let query = {_id:req.params.id}
    Attribute.findById(req.params.id, function(err, attribute){
        Attribute.remove(query, function(err){
            if(err){
            console.log(err);
            }
            res.send('Success');
        });
    });
});



// Combos Delete Route
router.delete('/combos/delete/:id', async function(req, res){
    let query = {_id:req.params.id}
    Combos.findById(req.params.id, function(err, attribute){
        Combos.remove(query, function(err){
            if(err){
            console.log(err);
            }
            res.send('Success');
        });
    });
});


//attribute Terms open by attribute id Route
router.get('/attribute-term/:id', function(req, res){
    Attribute.findById(req.params.id).then((result) => attributes(result)).catch((err) => res.status(404).json({'success': false, message: "error in getting result"}));
    function attributes(result){
        if(result){
            let pageTitle    = 'Products '+result.name;
            let termsobject  = result.terms;
            res.status(200).render('attribute-term-add.hbs', {
                pageTitle: pageTitle,
                attributes: result,
                keys: termsobject
            });
        } else {
            res.status(404).json({'success': false, message: "error in getting result"});
        }
    }   
});

//get data of terms of attribute for edit form
// router.get('/attribute-term-data', function(req, res){
//     let attributeID = req.query.attributeid;
//     let termslug    = req.query.slug;
//     Attribute.findById(attributeID).then((result) => attributedata(result)).catch((err) => res.status(404).json({success: false, message: "error in getting result"}));
//     function attributedata(result){
//         if(result){
//             let termData        = result.terms[termslug];
//             res.status(200).json({'success':true, 'message':"Attribute fetched successfully", 'termsdata':termData});
//         } else {
//             res.status(404).json({'success': false, 'message': "error in getting result"});
//         }
//     }   
// });

router.post('/attribute-term-delete', async function(req, res){
    let attributeID = req.body.attributeid;
    let termslug    = req.body.slug;
    let attrislug   = req.body.attrislug; // done for terms delete from product
    let attributeDetails        = await Attribute.findById(attributeID).select('-1');
    let termsObject             = attributeDetails.terms;
    let attributes              = {};
    delete termsObject[termslug]; 
    attributes.terms            = termsObject;
    /** code for terms delete in product */
    ProductMeta
        .find({attributes: { $elemMatch: { names: attrislug } }})
        .exec(function(err, productmeta) {
            productmeta.map( (metadetails, index)=> {
                let findattributes = metadetails.attributes;
                let variation = metadetails.variation;
                findattributes.map( (attrdetails, attrindex)=> {
                    let attriName = attrdetails.names;
                    let attrivalue = attrdetails.values;
                    if(attriName == attrislug) {
                        let attindex = attrivalue.indexOf(termslug);
                        if(attindex != -1){
                            attrivalue.splice(attindex, 1);
                        }
                        if(attrivalue.length == 0) {
                            findattributes.splice(attrindex, 1);
                        }
                    }
                });
                variation.map( (variationdetails, variationindex)=> {
                    let variatonValue = variationdetails[attrislug];
                    if(variatonValue == termslug) {
                        variationdetails[attrislug] = '';
                    }
                });
                let metaID = metadetails._id;
                let metadata = {};
                metadata.attributes = findattributes;
                metadata.variation = variation;
                let query = {_id:metaID};
                ProductMeta.update(query, metadata, function(err){
                    if(err){
                        res.json({ 'success': false, 'message': 'Error in Updating Attribute', errors: err });
                    }
                });
            });
    });
    /** code for terms delete in product */ 
    let query = {_id:attributeID}
    Attribute.update(query, attributes, function(err){
        if(err){
            return res.status(404).json({ success: false, message: 'Error in Adding Terms', errors: err });
        } else {
            return res.status(200).json({ 'success': true, 'message': 'Terms Delete Successfully'});
        }
    });
});



//attribute term get by slug
router.get('/term-by-slug', function(req, res){
    Attribute.find({slug: req.query.slug})
    .then((result) => attributes(result))
    .catch((err) => res.status(404).json({'success': false, 'message': "error in getting result"}));
    function attributes(result){
        if(result){
            let terms  = result['0']['terms'];
            res.status(200).json({'success': true, 'message': "fetching success", 'attributes': terms});
        } else {
            res.status(404).json({'success': false, 'message': "error in getting result"});
        }
    }   
});


// Attribute Term add post route
router.post('/attribute-term/add', async (req, res) => {
    let slug;
    let name                    = req.body.termtitle;
    let lowerCaseName           = name.toLowerCase()
    let withoutSpaceName        = lowerCaseName.trim();
    if(req.body.termslug) {
        slug                    = req.body.termslug;
    } else {
        slug                    = withoutSpaceName.replace(/\s+/g, '-');
    }

    let attributeDetails        = await Attribute.findById(req.body.attributeid).select('-1');
    let termsObject             = attributeDetails.terms;
    let description             = req.body.termdescripiton;
    let attributes              = {};
    if(termsObject) {
        termsObject[slug]           = {name: name, slug: slug, description: description};
        attributes.terms            = termsObject;
    } else {
       let terms                = {};
       terms[slug]              = {name: name, slug: slug, description: description};
       attributes.terms         = terms;
    } 
    let attributeId             = req.body.attributeid;
    let query = {_id:attributeId}
    Attribute.update(query, attributes, function(err){
        if(err){
            return res.status(404).json({ success: false, message: 'Error in Adding Terms', errors: err });
        } else {
            return res.status(200).json({ 'success': true, 'message': 'Terms Added Successfully'});
        }
    });
});


//DONT FORGET TO ADD ENSURE AUTHENTICATE IN THIS 
router.get('/api/getbyid/:id', async function(req, res){
    let productmeta = await ProductMeta.findById(req.params.id).populate('productid').populate('categoryid')
    
    if(productmeta){
        return res.status(200).json({status: true, product_details: productmeta})
    } else {
        let combo = await Combos.findById(req.params.id).populate('categoryid')
        console.log(combo)
        if(combo){
            return res.status(200).json({status: true, product_details: combo})
        } else {
            return res.status(400).json({status: false, error: "No such product with this ID"})
        }
    }
});

//DONT FORGET TO ADD ENSURE AUTHENTICATE IN THIS 
router.get('/api/getbyname/:id', async function(req, res){

    let toFind = req.params.id.replace(/-/g," ");
    console.log({toFind})
    let product = await Product.findOne({"producttitle":{ "$regex" : toFind , "$options" : "i"}}).populate('productid').populate('categoryid')
    console.log(product);
    if(product){
       let productmeta =  await ProductMeta.findOne({productid: product._id}).populate('productid').populate('categoryid')
        return res.status(200).json({status: true, product_details: productmeta})
    } else {
        let combo = await Combos.findOne({"title": { "$regex" : toFind , "$options" : "i"}}).populate('categoryid')
        console.log(combo)
        if(combo){
            return res.status(200).json({status: true, product_details: combo})
        } else {
            return res.status(400).json({status: false, error: "No such product with this ID"})
        }
    }
});


//Get all the categories
router.get('/api/categories/all', function(req, res){
    Category.find().then((data) => res.json({'success': true, categories: data}));
});

//Note: ensureAuthenticated to added in last after all development
router.get('/all-review', ensureAuthenticated, async function (req, res) {
    Product.find().then((products) => all_products(products)).catch((err) => res.json({status: false, error: err}));
    function all_products(products){
        res.render('all_product_reviews.hbs', {
            pageTitle: 'Products Reviews',
            products: products
        });
    }
});

router.post('/add-review', async (req, res) => {
    req.checkBody('title', 'Review Title is required').notEmpty();
    req.checkBody('description', 'Review Description is required').notEmpty();
    req.checkBody('productid', 'Product ID is required').notEmpty();
    req.checkBody('rating', 'Review Rating is required').notEmpty();
    req.checkBody('rating', 'Rating is number only').isNumeric();
    req.checkBody('userid', 'User ID is required').notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        res.json({ 'success': false, 'message': 'Validation error', 'errors': errors });
    }
    let review = new Review(req.body);
    review.save().then((reviews) => save_product_data(reviews)).catch((err) => res.json({'status': false, 'error': err}));
    function save_product_data(reviews){
        let productid = reviews.productid;
        Product.findById(productid, function(err, product){
            Review.find({productid: productid}, function(err, reviews){
                let totalRating     = 0;
                let totalCount      = 0;
                reviews.map( (item, index)=> {
                    totalRating = totalRating + item.rating;
                    totalCount++;
                });
                let averageRating = totalRating / totalCount;
                let products              = {};
                products.averagerating          = averageRating;
                products.totalreviews           = totalCount;
                let query = {_id:productid}
                Product.update(query, products, function(err){
                    if(err){
                        return res.status(404).json({ success: false, message: 'Error in Adding Review', errors: err });
                    } else {
                        return res.status(200).json({ 'success': true, 'message': 'Review Added Successfully'});
                    }
                });
            });
        });
    }
});

router.get('/reviews/:id', ensureAuthenticated, async function (req, res) {
    Review.find({productid: req.params.id})
    .populate('productid')
    .populate('userid')
    .then((reviews) => show_product_review(reviews))
    .catch((err) => res.json({status: false, error: err}));
    function show_product_review(reviews){
        res.render('single_product_reviews.hbs', {
            pageTitle: 'Product Reviews',
            reviews: reviews,
            productid: req.params.id,
        });
    }
});

router.post('/single-product-reviews', async function (req, res) {
    Review.find({productid: req.body.productid, status: 'accept'})
    .populate('productid')
    .populate('userid')
    .then((reviews) => res.status(200).json({status: true, reviews: reviews}))
    .catch((err) => res.json({status: false, error: err}));
});

router.post('/reviews-status-update', async function (req, res) {
    let review             = {};
    review.status          = req.body.status;
    let query = {_id:req.body.reviewid}
    Review.findOneAndUpdate(query, review, function(err){
        if(err){
           return res.status(404).json({ 'success': false, 'message': 'Error in Updating Review Status', errors: err });
        } else {
            return res.status(200).json({ 'success': true, 'message': 'Review Status Updated'});
        }
    });
});

// Delete Review
router.delete('/review-delete/:id', async function(req, res){
    let query = {_id:req.params.id}
    Review.findById(req.params.id, function(err, review){
        Review.remove(query, function(err){
            if(err){
                console.log(err);
            }
            res.send('Success');
        });
    });
});

// Access Control
function ensureAuthenticated(req, res, next) {
    if (req.user) {
        return next();
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect('/users/login');
    }
}

module.exports = router;
