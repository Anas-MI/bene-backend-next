const express       = require('express');
const fs            = require('fs-extra');
const router        = express.Router();
const path          = require('path');
const bodyParser    = require('body-parser');
const multer        = require('multer');
const db            = require('../config/database');
const Folder        = db.Folder;

const app = express();

app.use(bodyParser.json());

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/folders')
    },
    filename: (req, file, cb) => {
        let filename = file.originalname.split(".")[0];
      cb(null, filename + '-' +  Date.now() + path.extname(file.originalname))
    }
});

var upload = multer({storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        // if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.pdf') {
        //     req.fileValidationError = "Forbidden extension";
        //     return callback(null, false, req.fileValidationError);
        // }
        callback(null, true)
    }
    // limits:{
    //     fileSize: 420 * 150 * 200
    // }
});

router.get("/", (req, res) => {
    Folder.find().then(folders => res.status(200).json(folders)).catch(err => err)
})

router.post("/add", (req, res ) => {
    if (!fs.existsSync(`./public/folders/${req.body.folder}`)){
        fs.mkdirSync(`./public/folders/${req.body.folder}`);
    }
    let folder = new Folder({name: req.body.folder})
    folder.save().then(data => res.status(200).json(folder)).catch(err => err)
})

router.post("/files/add", upload.any(), async(req, res) => {
    console.log(req)
    if(req.body.folder){
        let files
        Folder.findOne({name: req.body.folder}, (err, folder) => {
            // console.log(req.files)
            files = [...folder.files]
            req.files.map( (item, index) => {
                console.log(item)
                let filepath = `./public/folders/${item.filename}`
                fs.move(`./public/folders/${item.filename}`, filepath);
                files.push({
                    name: item.filename,
                    path: filepath
                })
            })
            // console.log(files)
        })
    }     
})


module.exports = router