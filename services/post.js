const request = require('request');

const postQr = (userData, apiKey) => {
    const options = {
        'method': 'POST',
        'url': 'https://api.beaconstac.com/api/2.0/qrcodes/',
        'headers': {
          'Authorization': `Token ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "name": userData?.displayName,
            "qr_type": 2,
            "organization": 116496,
            "place": 121164,
            "custom_domain": null,
            "maintainer": 116643,
            "domain": 1,
            "meta": {
                "creator_id": 116643,
                "updater_id": 116643,
                "creator_email": "misteam@bespinglobal.ae",
                "updater_email": "misteam@bespinglobal.ae",
                "activationTimestamp": 1655357194,
                "dynamic_sub_campaign": "vcard_plus"
            },
            "campaign": {
                "content_type": 7,
                "vcard_plus": {
                "zip": "P.O. Box. 764668",
                "city": "Abu Dhabi",
                "email": userData?.mail,
                "phone": {
                    "home": null,
                    "work": "800677669",
                    "mobile": userData?.mobilePhone ? userData?.mobilePhone : ""
                },
                "layout": "default",
                "company": "Bespin Global",
                "country": "United Arab Emirates",
                "website": "https://www.bespinglobal.ae",
                "email_v2": [
                    {
                    "label": "",
                    "valid": "valid",
                    "value": userData?.mail
                    }
                ],
                "logo_url": "https://d1bqobzsowu5wu.cloudfront.net/116496/bulk-upload/vcard-plus/images/68bedea3fa4e424692938986ffc63306",
                "phone_v2": userData?.mobilePhone ? [
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
                ] : [
                    {
                    "label": "work",
                    "valid": "valid",
                    "value": "800677669"
                    }
                ],
                "last_name": userData?.surname,
                "address_v2": userData?.officeLocation,
                "first_name": userData?.givenName,
                "website_v2": [
                    {
                    "label": "",
                    "valid": "valid",
                    "value": "https://www.bespinglobal.ae"
                    }
                ],
                "address_url": "https://goo.gl/maps/yozmwKoe2vbvL25p8",
                "designation": userData?.jobTitle,
                "social_links": {
                    "yelp": null,
                    "venmo": null,
                    "vimeo": null,
                    "github": null,
                    "paypal": null,
                    "tiktok": null,
                    "twitch": null,
                    "wistia": null,
                    "behance": null,
                    "cashapp": null,
                    "discord": null,
                    "shopify": null,
                    "twitter": "https://twitter.com/bespinglobalmea",
                    "youtube": null,
                    "calendly": null,
                    "dribbble": null,
                    "facebook": "https://www.facebook.com/bespinglobalmea/",
                    "linkedin": "https://www.linkedin.com/company/14700541",
                    "snapchat": null,
                    "telegram": null,
                    "whatsapp": null,
                    "instagram": null,
                    "pinterest": null,
                    "custom_url": null
                },
                "state": "A",
                "address_line1": userData?.officeLocation,
                "customizations": {    
                    "font_style": "Arial",
                    "secondary_color": "#000000",
                    "title_font_size": 30,
                    "user_info_color": "#FFFFFF",
                    "background_color": "#000000"
                },
                }
            },
            "location_enabled": false,
            "attributes": {
                "color": "#000000",
                "margin": 80,
                "isVCard": false,
                "dotScale": 1,
                "colorDark": "#000000",
                "frameText": "SCAN ME",
                "logoImage": "",
                "logoScale": 0.2,
                "logoWidth": 0,
                "colorLight": "#ffffff",
                "frameColor": "#000000",
                "frameStyle": "none",
                "logoHeight": 0,
                "logoMargin": 10,
                "dataPattern": "square",
                "rectangular": false,
                "eyeBallColor": "#000000",
                "eyeBallShape": "square",
                "gradientType": "none",
                "eyeFrameColor": "#000000",
                "eyeFrameShape": "square",
                "frameTextColor": "#000000",
                "logoBackground": true,
                "backgroundColor": "#ffffff",
                "backgroundImage": "",
                "logoCornerRadius": null
            }
        })  
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

const postEmail = (applicationEmail, fileName, user, imageBase64, token) => {
    const email = {
        subject: `A QR for ${user} has just been generated!`,
        body: {
          contentType: 'html',
          content: 'This message contains an SVG image attachment of the generated QR'
        },
        toRecipients: [{
          emailAddress: {
            address: applicationEmail
          }
        }],
        attachments: [
          {
            "@odata.type": "#microsoft.graph.fileAttachment",
            contentBytes: imageBase64,
            name: `${fileName}.svg`
          }
        ]
      };
      
    const options = {
        'method': 'POST',
        'url': `https://graph.microsoft.com/v1.0/users/${applicationEmail}/sendMail`,
        'headers': {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({message: email})
    }

    return new Promise((resolve, reject) => {
        request(options, function(error, res, body) {
            if (!error && res.statusCode === 202) {
                resolve(true);
            } else {
                reject(error);
            }
        })
    })
}

const postBeaconStacForm = (keys, image, filename) => {
    const contentType = filename.toLowerCase().includes(".png") ? "image/png" : filename.toLowerCase().includes(".jp") ? "image/jpeg" : ""
    const options = {
        'method': 'POST',
        'url': 'https://s3.amazonaws.com/beaconstac-content',
        'headers': {
            'Host': 's3.amazonaws.com',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:103.0) Gecko/20100101 Firefox/103.0',
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Content-Type': 'multipart/form-data',
            'Origin': ' https://dashboard.beaconstac.com',
            'Connection': ' keep-alive',
            'Referer': ' https://dashboard.beaconstac.com/',
            'Sec-Fetch-Dest': ' empty',
            'Sec-Fetch-Mode': ' cors',
            'Sec-Fetch-Site': ' cross-sit'
        },
        formData: {
            'key': keys["key"],
            'Policy': keys["policy"],
            'X-Amz-Signature': keys["x-amz-signature"],
            'X-Amz-Algorithm': keys["x-amz-algorithm"],
            'X-Amz-Date': keys["x-amz-date"],
            'X-Amz-Credential': keys["x-amz-credential"],
            'X-Amz-Security-Token': keys["x-amz-security-token"],
            'Content-Type': contentType,
            'file': {
              'value': image,
              'options': {
                'filename': filename,
                'Content-Type': contentType
              }
            }
        }
    };

    return new Promise((resolve, reject) => {
        request(options, function (error, res, body) {
            if (!error && contentType && res.statusCode === 204) {
                resolve("Successfully uploaded image to Beaconstac");
            } else {
                reject(error);
            }
        });
    })
}

exports.postEmail = postEmail;
exports.postQr = postQr;
exports.postBeaconStacForm = postBeaconStacForm;