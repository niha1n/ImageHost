require('dotenv/config')
var express = require('express')
// const multer  = require('multer')
// const uuid= require('uuid').v4
const aws = require('aws-sdk')
var router = express.Router()


aws.config.update({
  region: 'ap-south-1'
})

const s3= new aws.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY
})



var bucketParams = {
  Bucket :  process.env.AWS_BUCKET_NAME
};

//setting Route to Display page

router.get('/', function(req, res, next) {
  
  s3.listObjects(bucketParams, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      // console.log("Success", data);
      let objects = data.Contents.map( ob => ob.Key)  //new array with current object IDs
      // console.log("new array = ", objects);    
      

      const urls = objects.map( y => s3.getSignedUrl('getObject', {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: y,
    }))

    // linkTxt= "https://image-host-1.s3.ap-south-1.amazonaws.com/"
    // const url= objects.map(el => linkTxt.concat(el))

      res.render("display",{
        list: objects.map(obj =>String(obj))
    })
    
      //  objects.forEach(elem => s3.getObject(params = {   //getting each elements one by one
      //   Bucket: process.env.AWS_BUCKET_NAME, 
      //   Key: elem
      //  }, function(err, data) {

      //   if (err) console.log(err, err.stack); 
      //   else     {
      //     console.log(data);      }        
      // }))
    }
  });
   
});

// var params = {  Bucket: process.env.AWS_BUCKET_NAME, Key: req.params.id }
//   s3.deleteObject(params, function(err, data) {
//     if (err) console.log(err, err.stack);  // error
//     else     console.log("deleted");       // deleted
//   });
 // var params = {  Bucket: process.env.AWS_BUCKET_NAME, Key: req.params.id }
  
 deleteImg = function(req,res,next){
  var params = {  Bucket: process.env.AWS_BUCKET_NAME, Key: req.params.id }
  s3.deleteObject(params, function(err, data) {
        if (err) console.log(err, err.stack);  // error
        else     console.log("deleted");       // deleted
      });
      next();
 }



router.get('/delete/:id',deleteImg,function(req, res) {
                res.redirect('/display')
  });


module.exports = router;



// var params = {  Bucket: process.env.AWS_BUCKET_NAME, Key: req.params.id }
//   s3.deleteObject(params, function(err, data) {
//         if (err) console.log(err, err.stack);  // error
//         else     console.log("deleted");       // deleted
//       });