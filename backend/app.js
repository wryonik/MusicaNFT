const express = require('express');
const path = require('path');
const app = express()
var SoxCommand = require('sox-audio');
var db = require('./db');
const multer = require('multer');
const port = process.env.PORT || 5000
app.use(express.json());
var cors = require('cors')
app.use(cors())


const audioStorage = multer.diskStorage({
    // Destination to store audio     
    destination: 'tracks', 
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

const audioUpload = multer({
    storage: audioStorage,
    limits: {
      fileSize: 200000000 // 1000000 Bytes = 1 MB
    },
    //fileFilter(req, file, cb) {
    //   if (!file.originalname.match(/\.(png|jpg)$/)) { 
    //      // upload only png and jpg format
    //      return cb(new Error('Please upload a audio'))
    //    }
    //cb(undefined, true)
  //}
}) 

// For Single audio upload
app.post('/uploadAudio', audioUpload.single('audio'), (req, res) => {
    // console.log((req.file)
    res.send(req.file);
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

app.post('/addAudio', function (req, res) {
    // console.log((req.body);
    db.filenameNFT.push({fileName : req.body.fileName, desc: req.body.desc, img: req.body.img, NFT : req.body.NFT});
    // console.log((db);
    res.send(200)
})

app.post('/mergeAudio', function (req, res) {
    var command = SoxCommand();
    // console.log(('running')
    req.body.tracks.forEach(audio => {
        command = command.input('./tracks/'+audio);
    });
    // console.log(('running')
    command = command.combine('merge');
    command = command.output('./tracks/'+req.body.name);
    command.on('error', function(err, stdout, stderr) {
        // console.log(('Cannot process audio: ' + err.message);
        // console.log(('Sox Command Stdout: ', stdout);
        // console.log(('Sox Command Stderr: ', stderr)
      });
    command.run();    
    // console.log((db);
    res.send(200);
})

app.get('/getMusic/:musicName', (req, res) => {
    var options = {
        root: path.join(__dirname)
    }; 
    res.sendFile('./tracks/'+req.params.musicName, options);
});

app.get('/getDB', (req, res) => { 
    res.send(db); 
});

app.listen(port, () => {
    // console.log(('Server is up on port ' + port);
})

// console.log((db)
