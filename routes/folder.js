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


router.post ("/files", (req, res) => {
    Folder.findOne({name: req.body.folder}).then(folder => res.status(200).json(folder)).catch(err => err)
})

router.post("/files/download", (req, res) => {
    console.log(req.body.path)
    // res.download('./public/folders/nimit18/dentistry-1603369564083.pdf');
    return res.sendFile(`C:/Users/nimum/OneDrive/Desktop/bene-backend-next/public/folders/${req.body.folder}/${req.body.file}`)
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
    let folder, files
    folder = await Folder.findOne({_id: req.body.id})
    console.log(folder)
    if(folder){
        files = [...folder.files]
        req.files.map( (item, index) => {
            let filepath = `./public/folders/${folder.name}/${item.filename}`
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
            console.log(item)
            files.push({
                name: item.filename,
                path: item.path
            })
        })
    }
    folder.files = files
    folder.save().then(data => res.status(200).json(folder)).catch(err => err)     
})


router.post("/delete", async (req, res) => {
    const folder = await Folder.findOne({_id: req.body.id})
    Folder.deleteOne({_id: req.body.id}).then(async () => {
        await fs.remove(`./public/folders/${folder.name}`)

        return res.status(200).json({message: 'Folder Deleted Successfully'})
    }).catch(err => err)
})

router.post("/edit", async(req, res) => {
    let folder = await Folder.findById(req.body.id)

    console.log(folder)
    if(folder){
        fs.renameSync(`./public/folders/${folder.name}`, `./public/folders/${req.body.folder}`)
        folder.name = req.body.folder
        let files = []
        folder.files.map((file) => {
            console.log(file)
            file.path = `./public/folders/${req.body.folder}/${file.name}`
            files.push(file)
        })
        console.log(files)
        folder.files = files
        folder.save().then(data => res.status(200).json(folder)).catch(err => err)
    }
})

router.post("/files/delete", async (req, res) => {
    let folder = await Folder.findOne({_id: req.body.id})
    let files = [...folder.files]
    let file = files.filter(file => file._id == req.body.fileId)[0]
    console.log(file)
    files = files.filter(file => file._id != req.body.fileId)

    folder.files = files
    fs.removeSync(`./public/folders/${folder.name}/${file.name}`)
    folder.save().then(data => res.status(200).json(folder)).catch(err => err)
})

router.post("/files/edit", async(req, res) => {
    let folder = await Folder.findOne({_id: req.body.id})
    console.log(folder.files)
    let files = [...folder.files]
    let file = files.filter(file => file._id == req.body.fileId)[0]

    console.log(file)
    fs.renameSync(`./public/folders/${folder.name}/${file.name}`, `./public/folders/${folder.name}/${req.body.fileName}`)
    files = []
    folder.files.map(item => {
        if(item._id === file._id){

            item.name = req.body.fileName

            item.path = `./public/folders/${folder.name}/${req.body.fileName}`
        }
        files.push(item)
    })
    console.log(files)
    folder.files = files
    folder.save().then(data => res.status(200).json(folder)).catch(err => err)
})
 
module.exports = router