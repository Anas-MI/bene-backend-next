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
    console.log(req.body)
    if (!fs.existsSync(`./public/folders/${req.body.folder}`)){
        fs.mkdirSync(`./public/folders/${req.body.folder}`);
    }
    let folder = new Folder({name: req.body.folder})
    folder.save().then(data => res.status(200).json(folder)).catch(err => err)
})

router.post("/files/add", upload.any(), async(req, res) => {
    let folder, files
    if(req.body.folder){
        folder = await Folder.findOne({name: req.body.folder})
        files = [...folder.files]
        req.files.map( (item, index) => {
            let filepath = `./public/folders/${req.body.folder}/${item.filename}`
            fs.move(`./public/folders/${item.filename}`, filepath);
            files.push({
                name: item.filename,
                path: filepath
            })
        })
    }else{
        let folder = await Folder.findOne({name: 'root'})
        files = [...folder.files]
        req.files.map( (item, index) => {
            files.push({
                name: item.filename,
                path: item.path
            })
        })
    }
    folder.save().then(data => res.status(200).json(folder)).catch(err => err)     
})

router.post("/delete/:id", (req, res) => {
    Folder.deleteOne({_id: req.params.id}).then(async () => {
        await fs.remove(`./public/folders/${req.body.name}`)
        return res.status(200).json({message: 'Folder Deleted Successfully'})
    }).catch(err => err)
})

router.post("/edit/:id", async(req, res) => {
    let folder = await Folder.findById(req.params.id)
    console.log(folder)
    if(folder){
        fs.renameSync(`./public/folders/${folder.name}`, `./public/folders/${req.body.name}`)
        folder.name = req.body.name
        let files = folder.files.map((file) => {
            file.location = `./public/folders/${req.body.name}/${file.name}`
        })
        folder.files = files
        folder.save().then(data => res.status(200).json(folder)).catch(err => err)
    }
})

router.post("/files/delete/:id", (req, res) => {
    let folder = Folder.findOne({_id: req.params.id})
    let files = [...folder.files]
    files = files.filter(file => file.name !== req.body.fileName)
    folder.files = files
    fs.removeSync(`./public/folders/${folder.name}/req.body.fileName`)
    folder.save().then(data => res.status(200).json(folder)).catch(err => err)
})

router.post("/files/edit/:id", (req, res) => {
    let folder = Folder.findOne({_id: req.params.id})
    let files = [...folder.files]
    let file = files.filter(file => file._id === req.body.id)[0]
    fs.renameSync(`./public/folders/${folder.name}/${file.name}`, `./public/folders/${folder.name}/${req.body.filename}`)
    files = files.map(item => {
        if(item._id === file._id){
            item.path = `./public/folders/${folder.name}/${req.body.filename}`
        }
    })
    folder.files = files
    folder.save().then(data => res.status(200).json(folder)).catch(err => err)
})
 
module.exports = router