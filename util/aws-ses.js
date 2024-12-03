// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({
    accessKeyId: process.env.API_KEY,
    secretAccessKey: process.env.API_SECRET_KEY,
    region: 'us-east-1'
});
// Create sendEmail params 
exports.sendMail = function (to, cc, subject, htmlBody, txtBody, from, replyTo) {
    const emailCC = (cc) ? [cc] : [];

    var params = {
        Destination: {
            CcAddresses: emailCC,
            ToAddresses: [to],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: htmlBody
                },
                Text: {
                    Charset: "UTF-8",
                    Data: txtBody
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject,
            }
        },
        Source: from,
        ReplyToAddresses: [
            replyTo
        ]
    };

    var sendPromise = new AWS.SES({ apiVersion: '2010-12-01' })
        .sendEmail(params)
        .promise();

    sendPromise.then(
        function (data) {
        })
        .catch(
            function (err) {
                console.error(err, err.stack);
            }
        );
}

exports.sendMailMultiple = function (to, cc, subject, htmlBody, txtBody, from, replyTo) {
    const emailCC = (cc) ? [cc] : [];
    var params = {
        Destination: {
            CcAddresses: emailCC,
            ToAddresses: to,
        },
        Message: { 
            Body: { 
                Html: {
                    Charset: "UTF-8",
                    Data: htmlBody
                },
                Text: {
                    Charset: "UTF-8",
                    Data: txtBody
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject,
            }
        },


        Source: from, 


        ReplyToAddresses: [
            replyTo
        ]
    };

    var sendPromise = new AWS.SES({ apiVersion: '2010-12-01' })
        .sendEmail(params)
        .promise();

    sendPromise.then(
        function (data) {
        }).catch(
            function (err) {
                console.error(err, err.stack);
            });
}






