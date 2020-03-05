const express       = require('express');
const router        = express.Router();
const path          = require('path');
var aws             = require('aws-sdk');
var bodyParser      = require('body-parser');
var multer          = require('multer');
var multerS3        = require('multer-s3');
const db            = require('../config/database');
const Category      = db.Category

aws.config.update({
    secretAccessKey: process.env.SECRETACCESSKEY,
    accessKeyId: process.env.ACCESSKEYID,
    region: process.env.REGION
});

const app = express();
const s3 = new aws.S3();

app.use(bodyParser.json());

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.BUCKET,
        metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, Date.now() + '-prd-' + file.originalname);
        }
    }),
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
    }
});

// Add Route
router.get('/add', ensureAuthenticated, function (req, res) {
    res.render('add_category.hbs', {
        pageTitle: 'Add Category'
    });
});

router.post('/add', upload.single('categoryimage'), (req, res, next) => {
    req.checkBody('categorytitle', 'Title is required').notEmpty();
    req.checkBody('categorydescription', 'Category Description is required').notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        if(req.file) {
            let filename = req.file.location;
            var params = {
                Bucket: 'elasticbeanstalk-us-east-2-797993184252',
                Key: filename
            };
            s3.deleteObject(params, function (err, data) {
                if (data) {
                    console.log("File deleted successfully");
                }
                else {
                    console.log("Check if you have sufficient permissions : "+err);
                }
            });
        }
        return res.status(404).json({ 'success': false, 'message': 'Validation error', errors: errors });
    }

    if (req.fileValidationError) {  
        return res.status(404).json({ 'success': false, 'message': 'File Validation error', errors: req.fileValidationError });   
    }

    let category                = new Category();
    let categoryTitle           = req.body.categorytitle;
    let categorySlug            = req.body.categoryslug;
    category.categorytitle      = categoryTitle;
    category.catdescription     = req.body.categorydescription;
    category.categoryslug       = categorySlug;
    category.blockedcountries   = req.body.country;
    if(req.body.parentid) {
        category.parentid       = req.body.parentid;
    }
    if(req.file) {
        category.filepath = req.file.location;
        category.filename = req.file.key;
    }
    category.save(function (err) {
        if (err) {
            return res.status(404).json({ 'success': false, 'message': 'Error in Saving Category', errors: err });
        } else {
            return res.status(200).json({ 'success': true, 'message': 'Category Added'});
        }
    });
});

router.get('/all', ensureAuthenticated, function (req, res) {
    let countries = ['Hong Kong', 'Japan', 'Republic of Korea', 'Singapore', 'Taiwan', 'Thailand', 'Andorra', 'Austria', 'Belgium', 'Bulgaria', 'Cyprus', 'Czech', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Iceland', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Monaco', 'Netherlands', 'Norway', 'Poland', 'Portugal', 'Romania', 'San Marino', 'Slovak Republic', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'United Kingdom'];
    Category.find({}, function (err, categories) {
        if (err) return res.status(404).render('all_category.hbs', {
            pageTitle: 'All Categories',
            error:err,
            message:'Error In fatching Categories'
            });
        if(categories) {
            res.render('all_category.hbs', {
                pageTitle: 'All Categories',
                categories: categories,
                countries: countries
            });
        }
    }).sort({categoryid: 'asc'});
});

router.get('/getcategories', function (req, res) {
    Category.find({}, function (err, categories) {
        if (err) {
            return res.status(404).json({ 'success': false, 'message': 'Error in fetching Categorys Record' });
        } else {
            return res.status(200).json({ 'success': true, 'categories': categories });
        }
    }).sort({categoryid: 'asc'});
});

router.get('/:id', function(req, res){
    Category.findById(req.params.id, function(err, categories){
        if (err) {
            return res.status(404).json({ 'success': false, 'message': 'error in fetching Category details' });
        } else {
            return res.status(200).json({ 'success': true, 'categories': categories });
        }
    });
});


router.post('/edit/:id', upload.single('brandimage'), function(req, res){
    req.checkBody('categorytitle', 'Title is required').notEmpty();
    req.checkBody('categorydescription', 'Category Description is required').notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        if(req.file) {
            let filename = req.file.location;
            var params = {
                Bucket: 'elasticbeanstalk-us-east-2-797993184252',
                Key: filename
            };
            s3.deleteObject(params, function (err, data) {
                if (data) {
                    console.log("File deleted successfully");
                }
                else {
                    console.log("Check if you have sufficient permissions : "+err);
                }
            });
        }
        return res.status(404).json({ 'success': false, 'message': 'Validation error', errors: errors });
    } 
    
    if (req.fileValidationError) {
        return res.status(404).json({ 'success': false, 'message': 'File Validation error', errors: req.fileValidationError });    
    }


    let category                = {};
    category.categorytitle      = req.body.categorytitle;
    category.catdescription     = req.body.categorydescription;
    category.blockedcountries   = req.body.country;
    if(req.file) { 
        category.filepath       = req.file.location;
        category.filename       = req.file.key;
        var params = {
            Bucket: 'elasticbeanstalk-us-east-2-797993184252',
            Key: req.body.previousfilename
        };
        s3.deleteObject(params, function (err, data) {
            if (data) {
                console.log("File deleted successfully");
            }
            else {
                console.log("Check if you have sufficient permissions : "+err);
            }
        });
    }
    if(req.body.parentid){
        category.parentid       = req.body.parentid;
    }
    let query = {_id:req.params.id}
    Category.update(query, category, function(err){
        if(err){
            return res.status(404).json({ 'success': false, 'message': 'Error in Updating Category', errors: err });
        } else {
            return res.status(200).json({ 'success': true, 'message': 'Category Updated'});
        }
    });
        
    
});

router.delete('/:id', async function(req, res){
    let query = {_id:req.params.id}
    let categoryExist = await Category.findById(req.params.id).select('-1');
    if(categoryExist) {
        Category.remove(query, function(err){
            if(err){
            console.log(err);
            }
            res.send('Success');
        });
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