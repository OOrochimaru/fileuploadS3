const express = require('express');
const mongoOp = require('./mongo');
const app = express();

const multer = require('multer');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const AWS = require('aws-sdk');


app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

mongoose.connect('mongodb://localhost:27017/finalUpload', {useNewUrlParser: true});
mongoose.set('debug', 'true');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

let storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/image')
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-'+ Date.now());
    }
})


let upload = multer({storage: storage});
const fs = require('fs');

var bucket = "s3-blog-bucket";
var s3Client = new AWS.S3({
    accessKeyId: 'AKIAJNTAW7MYAKJFXPDA',
    secretAccessKey: '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'
})

app.post('/upload', upload.single('znyak'), (req, res)=>{
    console.log(req.file);
    if(!req.file){
        console.log("hello");
    }else{
        console.log("else part");
        let pathname = 
        s3Client.putObject({
            Bucket: bucket,
            Key: req.file.filename,
            ACL: 'public-read',
            Body: fs.readFileSync(req.file.path),
            ContentLength: req.file.size,
            ContentType: req.file.mimetype,
        }, function(err, data){
            if (err) {
                return res.json({error: "errorwhile uploading"});
            }
            let imageUrl = "https://s3.us-east-2.amazonaws.com/"+bucket+"/"+req.file.filename;
            console.log("image url", imageUrl); 
            
            
            return res.json({success: 'successfully uploaded', data: imageUrl});
        })

    }
});
app.get('/upload', function(req, res, next){
    console.log("helllllll");
})

app.listen(8000);


























// router.get('/users', function(req, res, next){
//     var pageNo = parseInt(req.query.pageNo);
//     var size = parseInt(req.query.size);
//     var query = {};

//     if (pageNo <= 0) {
//         response = {"error" : true,"message" : "invalid page number, should start with 1"};
//         return res.json(response)
//     }
//     query.skip = size *( pageNo - 1)
//     query.limit = size;

//     mongoOp.find({}, {}, query, function(err, data){
//         if(err) {
//             response = {"error" : true,"message" : "Error fetching data"};
//         } else {
//             response = {"error" : false,"message" : data};
//         }
//         res.json(response);
//     });
// });