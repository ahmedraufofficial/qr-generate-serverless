const request = require('request');

const putToSharepoint = (data, siteUrl, fileName, token) => {
    const options = {
        method: 'put',
        url: `${siteUrl}/${fileName}.svg:/content`,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'image/svg+xml',
        },
        body: data
    };
    return new Promise((resolve, reject) => {
        request(options, function(error, res, body) {
            if (!error && res.statusCode === 201) {
                resolve(body);
            } else {
                reject(error);
            }
        })
    })
}

const putQr = (id, userData, userQr, apiKey) => {
    const initialValues = userQr
    initialValues.name = userData.displayName
    initialValues.campaign.vcard_plus.last_name = userData?.surname
    initialValues.campaign.vcard_plus.email = userData?.mail
    initialValues.campaign.vcard_plus.first_name = userData?.givenName
    initialValues.campaign.vcard_plus.designation = userData?.jobTitle
    initialValues.campaign.vcard_plus.address_line1 = userData?.officeLocation
    initialValues.campaign.vcard_plus.address_v2 = userData?.officeLocation
    if (initialValues.campaign?.vcard_plus?.email_v2.length > 0) {
        initialValues.campaign.vcard_plus.email_v2[0]["value"] = userData?.mail
    }
    if (userData?.mobilePhone) {
        initialValues.campaign.vcard_plus.phone.mobile = userData?.mobilePhone
        initialValues.campaign.vcard_plus.phone_v2 = [
            {
                "label": "work",
                "valid": "valid",
                "value": "800677669"
            },
            {
                "label": "mobile",
                "valid": "valid",
                "value": userData?.mobilePhone
            }
        ]
    } else if (!initialValues.campaign.vcard_plus?.phone_v2?.value){
        initialValues.campaign.vcard_plus.phone_v2 = [
            {
                "label": "work",
                "valid": "valid",
                "value": "800677669"
            }
        ]
    }
    if (userData?.user_image_url) {
        initialValues.campaign.vcard_plus.user_image_url = userData.user_image_url
    }
    delete initialValues.id
    delete initialValues.created
    delete initialValues.updated
    const options = {
        'method': 'PUT',
        'url': `https://api.beaconstac.com/api/2.0/qrcodes/${id}/`,
        'headers': {
          'Authorization': `Token ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(initialValues)  
    };
    return new Promise((resolve, reject) => {
        request(options, function(error, res, body) {
            if (!error && res.statusCode === 200) {
                console.log("Success")
                resolve(body);
            } else {
                console.log("Error")
                reject(error);
            }
        })
    })
}

const putImageVisibilty = (id, filename, apiKey) => {
    const contentType = filename.toLowerCase().includes(".png") ? "image/png" : filename.toLowerCase().includes(".jp") ? "image/jpeg" : ""
    const options = {
        'method': 'PUT',
        'url': `https://api.beaconstac.com/api/2.0/media/${id}/`,
        'headers': {
          'Authorization': `Token ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "content_type": contentType,
          "name": filename,
          "visible": true
        })
    };
    return new Promise((resolve, reject) => {
        request(options, function (error, res, body) {
            if (!error && contentType && res.statusCode === 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    })

}

exports.putQr = putQr;
exports.putToSharepoint = putToSharepoint;
exports.putImageVisibilty = putImageVisibilty;