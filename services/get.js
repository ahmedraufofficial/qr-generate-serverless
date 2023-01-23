const qs = require('qs');
const axios = require('axios');
const request = require('request');
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const getToken = (endpoint, credentials) => {
    return new Promise((resolve, reject) => {
        axios.post(endpoint, qs.stringify(credentials))
        .then(response => {
            resolve(response.data?.access_token)
        })
        .catch(error => {
            reject(error);
        })
    })
}

const getUser = (token, userId) => {
    const options = {
        method: 'get',
        url: `https://graph.microsoft.com/v1.0/${userId}?$select=onPremisesExtensionAttributes,displayName,givenName,jobTitle,mail,mobilePhone,officeLocation,surname,userPrincipalName,id,businessPhones`,
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    return new Promise((resolve, reject) => {
        request(options, function (error, res, body) {
            if (!error && res.statusCode === 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    })
}

const getQrUrl = (id, apiKey) => {
    const options = {
        'method': 'GET',
        'url': `https://api.beaconstac.com/api/2.0/qrcodes/${id}/download/?size=1024&error_correction_level=5&canvas_type=svg`,
        'headers': {
          'Authorization': `Token ${apiKey}`,
          'Content-Type': 'application/json'
        }
    };
    return new Promise((resolve, reject) => {
        request(options, function (error, res, body) {
            if (!error && res.statusCode === 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    })
}

const getSvgBinary = (url) => {
    return new Promise((resolve, reject) => {
        request.get(url, function (error, res, body) {
            if (!error && res.statusCode === 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    })
}

const getQr = (qrId, apiKey) => {
    const options = {
        'method': 'GET',
        'url': `https://api.beaconstac.com/api/2.0/qrcodes/${qrId}`,
        'headers': {
          'Authorization': `Token ${apiKey}`,
          'Content-Type': 'application/json'
        }
    };
    return new Promise((resolve, reject) => {
        request(options, function (error, res, body) {
            if (!error && res.statusCode === 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    })
}

const getQrList = (name, apiKey) => {
    const options = {
        'method': 'GET',
        'url': `https://api.beaconstac.com/api/2.0/qrcodes/?state=A&name=${name}`,
        'headers': {
          'Authorization': `Token ${apiKey}`,
          'Content-Type': 'application/json'
        }
    };
    return new Promise((resolve, reject) => {
        request(options, function (error, res, body) {
            if (!error && res.statusCode === 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    })
}

const getDelta = (token, list) => {
    let date = new Date();
    date.setMinutes(date.getMinutes() - 2);
    const options = {
        method: 'GET',
        url: `${list}/items?$filter=Modified gt datetime'${date.toISOString()}'`,
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };
    return new Promise((resolve, reject) => {
        request(options, function (error, res, body) {
            if (!error && res.statusCode === 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    })
}

exports.getToken = getToken;
exports.getUser = getUser;
exports.getQrUrl = getQrUrl;
exports.getSvgBinary = getSvgBinary;
exports.getQr = getQr;
exports.getQrList = getQrList;
exports.getDelta = getDelta;