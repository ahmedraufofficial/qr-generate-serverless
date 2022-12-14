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
                    "mobile": ""
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
                "phone_v2": [
                    {
                    "label": "work",
                    "valid": "valid",
                    "value": "800677669"
                    },
                    {
                    "label": "mobile",
                    "valid": "valid",
                    "value": userData?.mobilePhone || null
                    }
                ],
                "last_name": userData?.surname,
                "address_v2": "Al Wafra Square Building, Al Ghazal Street, Al Reem Island, Abu Dhabi P.O. Box. 764668, United Arab Emirates",
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

const postToSharepoint = (data, siteUrl, fileName, token) => {
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
                console.log("HERE")
                resolve(body);
            } else {
                console.log("Error")
                reject(error);
            }
        })
    })
}

exports.postQr = postQr;
exports.postToSharepoint = postToSharepoint;