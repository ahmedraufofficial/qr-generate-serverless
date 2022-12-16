const request = require('request');

const patchUser = (token, userId, qrId) => {
    const options = {
        'method': 'PATCH',
        'url': `https://graph.microsoft.com/v1.0/${userId}`,
        'headers': {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "onPremisesExtensionAttributes": {
            "extensionAttribute1": qrId
          }
        })
      
      };
    return new Promise((resolve, reject) => {
        request(options, function (error, res, body) {
            if (!error && res.statusCode === 204) {
                resolve(`Successfully Updated User. ${body}`);
            } else {
                reject(error);
            }
        });
    })
}

exports.patchUser = patchUser;