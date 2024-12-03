var AWS = require('aws-sdk');
const User = require("../models/user");
// Set region
AWS.config.update({ region: 'ap-southeast-1' });

const awsSns = new AWS.SNS({ apiVersion: '2010-03-31' });

exports.sendTranSms = function (params) {
    var attri = {
        attributes: { /* required */
            'DefaultSMSType': 'Transactional', /* highest reliability */
            'DefaultSenderID': 'SKOOTR'
        }
    };
    const publishTextPromise = awsSns.setSMSAttributes(attri).promise()
        .then(data => {
            return awsSns.publish(params).promise();
        })
        .catch(err => {
            console.log(err);
            return null;
        });

    return publishTextPromise;
}

exports.sendPromoSms = function (params) {
    var attri = {
        attributes: { 
            'DefaultSMSType': 'Promotional' 
        }
    };

    const publishTextPromise = awsSns.setSMSAttributes(attri).promise()
        .then(data => {
            return awsSns.publish(params).promise();
        })
        .catch(err => {
            console.log(err);
            return null;
        });
    return publishTextPromise;
}

exports.sendTransnlToUser = function (user_ids, msg) {
    var attri = {
        attributes: {
            'DefaultSMSType': 'Transactional', 
            'DefaultSenderID': 'SKOOTR'
        }
    };


    User.findAll({ where: { id: user_ids }, attributes: ['isd_code', 'phone'] })
        .then(users => {
            for (var i = 0; i < users.length; i++) {
                let user = users[i];
                const params = {
                    Message: msg,
                    phone_number: user.isd_code + user.phone
                };
                awsSns.setSMSAttributes(attri).promise()
                    .then(data => {
                        awsSns.publish(params).promise();
                    })
                    .catch(err => {
                    });
            }

        })
        .catch(err => {
            console.log(err);
        })
}