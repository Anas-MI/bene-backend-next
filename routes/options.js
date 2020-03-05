const express           = require('express');
const router            = express.Router();
const aws               = require('aws-sdk');
const cors              = require('cors');
const bodyParser        = require('body-parser');
const multer            = require('multer');
const multerS3          = require('multer-s3');
const path              = require('path');
const moment            = require('moment-timezone');
const querystring       = require('querystring');
const db                = require('../config/database');
const Option            = db.Option;

aws.config.update({
    secretAccessKey: process.env.SECRETACCESSKEY,
    accessKeyId: process.env.ACCESSKEYID,
    region: process.env.REGION
});

const app = express();
const s3 = new aws.S3();

app.use(bodyParser.json());


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


router.post('/addoptions', upload.any(), async function (req, res, next) {
    let filesArray = req.files;
    if(req.files) {
        let optionsData = {};
        filesArray.map( async (item, index)=> {
            console.log({item: item});
            optionsData.optionname  = item.path;
            optionsData.optionvalue = item.location;
            let options = { upsert: true, new: true, setDefaultsOnInsert: true };
            if(await Option.findOneAndUpdate({optionname:item.fieldname}, optionsData, options).then((data) => console.log({saved_data: data}))) {
            } else {
                return res.status(400).json({ 'success': false, 'message': 'Error In saving'+item.fieldname });
            }
        });
    }
    let bodyFields = req.body;
    console.log({bodyfields: bodyFields});
    var bodyOptionData = {};
    delete bodyFields['logo'];
    delete bodyFields['favicon'];
    Object.keys(bodyFields).forEach(async function eachKey(key) {
        if(key != "logo" || key != "favicon") {
            console.log(key+ " is being saved");
            console.log(bodyFields[key] + " is this");
            bodyOptionData.optionname  = key;
            bodyOptionData.optionvalue = bodyFields[key];
            // bodyOptionData.save().then((data) => console.log({after_save: data}))
            let options = { upsert: true, new: true, setDefaultsOnInsert: true };
            console.log({key: key});

            if(await Option.findOneAndUpdate({optionname:key}, bodyOptionData, options).exec()) {
            //  bodyOptionData.save().then((data) => console.log({after_save: data})){   
        } 
        // else {


        //         return res.status(400).json({ 'success': false, 'message': 'Error In saving'+key });
        //     }
        }
    });
    return res.status(200).json({ 'success': true, 'message': 'Successfully Saved the Setting' });
});


router.get('/all', ensureAuthenticated, async function (req, res, next) {
    let optionvalues = [];
     optionvalues  = await Option.find({}).select('-1').sort({_id: 'asc'});
        
        function assignVal(tofind){
                
                let value = optionvalues.filter(function(el) {
                    return el.optionname === tofind;
                });
                return value[0].optionvalue;}
                
        // for(let i = 0 ; i< tofindarr.length; i++){
                
                
        //         var toFind = tofindarr[i];
        //         vararr[i]  = optionvalues.filter(function(el) {
        //             return el.optionname === toFind;
        //         });
                
                
        // }
   

   


//Removing one particular name field
//     let optionvalues = [];
//     optionvalues  = await Option.find({}).select('-1').sort({_id: 'asc'});
//    console.log(optionvalues);
//    var toFind = "logo";
//    var filtered = optionvalues.filter(function(el) {
//        return el.optionname === toFind;
//    });

//    console.log(filtered[0].optionvalue);



    // if(optionvalues.length > 0) {
    //     let logoURL             = optionValues[0].optionvalue;
    //     let favIcon             = optionValues[1].optionvalue;
    //     let primarycolor        = optionValues[2].optionvalue;
    //     let secondarycolor      = optionValues[3].optionvalue;
    //     let tertiarycolor       = optionValues[4].optionvalue;
    //     let shadowcolor         = optionValues[5].optionvalue;
    //     let bordercolor         = optionValues[6].optionvalue;
    //     let fontcolor           = optionValues[7].optionvalue;
    //     let linkcolor           = optionValues[8].optionvalue;
    //     let linkhovercolor      = optionValues[9].optionvalue;
    //     let headingcolor        = optionValues[10].optionvalue;
    //     let bodyfontfamily      = optionValues[11].optionvalue;
    //     let bodyfontsize        = optionValues[12].optionvalue;
    //     let bodyfontweight      = optionValues[13].optionvalue;
    //     let titlefontsize       = optionValues[14].optionvalue;
    //     let titlefontweight     = optionValues[15].optionvalue;
    //     let copyrighttext       = optionValues[16].optionvalue;
    
    if(optionvalues.length > 0) {
    res.status(200).render('settings.hbs', {
            
            pageTitle: 'Settings',
            logo: assignVal('logo'),
            favicon: assignVal('favicon'),
            primarycolor: assignVal('maincolor'),
            primarybgcolor: assignVal('mainbgcolor'),
            secondarycolor: assignVal('themesecnodarycolor'),
            secondarybgcolor: assignVal('themesecnodarybgcolor'),
            tertiarycolor: assignVal('themetertiarycolor'),
            tertiarybgcolor: assignVal('themetertiarybgcolor'),
            shadowcolor: assignVal('shadowcolor'),
            bordercolor: assignVal('bordercolor'),
            fontcolor: assignVal('fontcolor'),
            linkcolor: assignVal('linkcolor'),
            linkhovercolor: assignVal('linkhovercolor'),
            headingcolor: assignVal('headingcolor'),
            bodyfontfamily: assignVal('bodyfontfamily'),
            bodyfontsize: assignVal('bodyfontsize'),
            bodyfontweight: assignVal('bodyfontweight'),
            titlefontsize: assignVal('titlefontsize'),
            titlefontweight: assignVal('titlefontweight'),
            copyrighttext: assignVal('copyrighttext'),
            headingcolor: assignVal('headingcolor'),
            color: assignVal('color'),
            mainbgcolor: assignVal('mainbgcolor'),
            themesecnodarybgcolor: assignVal('themesecnodarybgcolor'),
            themetertiarybgcolor: assignVal('themetertiarybgcolor'),
            button_color: assignVal('buttoncolor'),
            button_hover: assignVal('butonhover'),
            darkbgcolor: assignVal('darkbgcolor'),
            lightbgcolor: assignVal('lightbgcolor'),
            maintextcolor: assignVal('maintextcolor'),
            buttoncolor1: assignVal('buttoncolor1'),
            buttoncolor2: assignVal('buttoncolor2'),
            buttoncolor3: assignVal('buttoncolor3'),
            buttoncolor4: assignVal('buttoncolor4'),
            buttoncolor5: assignVal('buttoncolor5'),
            buttoncolor6: assignVal('buttoncolor6'),
            buttoncolor7: assignVal('buttoncolor7'),
            buttoncolor8: assignVal('buttoncolor8'),
            buttoncolor9: assignVal('buttoncolor9'),
            buttoncolor10: assignVal('buttoncolor10'),
            mainfontfamily: assignVal('mainfontfamily'),
            subfontfamily: assignVal('subfontfamily'),
            parasize: assignVal('parasize'),
            headingsize1: assignVal('headingsize1'),
            headingsize2: assignVal('headingsize2'),
            headingsize3: assignVal('headingsize3'),
            headingsize4: assignVal('headingsize4'),
            headingsize5: assignVal('headingsize5'),
            headingsize6: assignVal('headingsize6'),
            buttoncolort2 : assignVal('buttoncolort2'),
            maintitlesize : assignVal('maintitlesize'),
            cardbackground2 : assignVal('cardbackground2'),
            cardbackground : assignVal('cardbackground')
        });
    } else {
        res.status(200).render('settings.hbs', {
            pageTitle: 'Settings'
        });
}}
)


router.get('/getsitesettings', async function (req, res, next) {
    let optionValues = await Option.find().select('-1').sort({_id: 'asc'});
    res.status(200).json({ 'success': true, 'options':optionValues });
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