const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path')

AWS.config.update({
    accessKeyId: process.env.API_KEY,
    secretAccessKey: process.env.API_SECRET_KEY,
    region: 'us-east-1'
});
const s3 = new AWS.S3();
var myBucket = process.env.BUCKET_NAME

exports.uploadFile = function (file, key) {
  
    return new Promise(function (resolve, reject) {
        fs.readFile(file.path, function (err, data) {
            if (err) {
                throw err;
            }
            params = {
                Bucket: myBucket,
                Key: key,
                Body: data,
                ACL: 'public-read',
                ContentType: file.mimetype
            };
            s3.putObject(params, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(key);
                }
            });
        });
    })
} 


exports.uploadFiles = function (files, prefix) {
    return new Promise(function (resolve, reject) {
        var s3KeyArr = [];
        for (var i = 0; i < files.length; i++) {
            const file = files[i];
            let fileExt = path.extname(file.originalname);
            let myKey = prefix + file.filename;
            fs.readFile(file.path, function (err, data) {
                if (err) {
                    throw err;
                }
                params = {
                    Bucket: myBucket,
                    Key: myKey,
                    Body: data,
                    ACL: 'public-read',
                    ContentType: file.mimetype
                };
                s3.putObject(params, function (err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        s3KeyArr.push({
                            "s3key": myKey
                        });
                        fs.unlinkSync(file.path);

                        if (s3KeyArr.length === files.length) {
                            resolve(s3KeyArr);
                        }
                    }
                });
            });
        }
    });
}

exports.uploadUserStats = function (screenShot, screenName) {
    return new Promise(function (resolve, reject) {
        params = {
            Bucket: myBucket,
            Key: `userStats/${screenName}.png`,
            Body: screenShot,
            ACL: 'public-read',
            ContentType: "image/png"
        };
        s3.putObject(params, function (err, data) {
            if (err) {
                reject(err);
                 console.log(err)
            } else {
                resolve(process.env.BUCKET+`/userStats/${screenName}.png`);
            }
        });
    })
}