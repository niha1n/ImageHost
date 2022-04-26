require('dotenv/config')
var express = require('express')
const multer  = require('multer')
const uuid= require('uuid').v4
const aws = require('aws-sdk')
var router = express.Router()

//setting s3 params
const s3= new aws.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY
})
const storage= multer.memoryStorage({
  destination: function(req, file, callback){
    callback(null, '')
  }
})

const upload = multer({storage}).single('img') // upload funtion

//Home page
router.get('/', function(req, res) {
  res.render('index');
});
//Upload feauture
router.post('/upload',upload,(req,res)=>{  
  let myImg= req.file.originalname.split(".")
  const fileType = myImg[myImg.length - 1]

  // console.log(req.file)
    const params={        
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${uuid()}.${fileType}`,
    Body: req.file.buffer
  }  
  s3.upload(params, (err,data)=> {
    if(err){
      res.status(500).send(err)
        }
    // res.status(200).send(data)
    res.redirect('/')
  })
})

//login page
router.get('/login',function(req,res){
  res.render('login')
})

module.exports = router;
