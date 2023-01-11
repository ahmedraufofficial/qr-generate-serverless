var request = require('request');
var qr = require('node-qr-image');


const getUsers = () => {
  const options = {
    'method': 'GET',
    'url': 'https://api.beaconstac.com/api/2.0/qrcodes/?page=2&state=A',
    'headers': {
      'Authorization': 'Token 1d13d7f54396e64b2464bf5e20ab9e9343ac44ff',
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

const updateUser = (userId, qrId) => {
  const token = "eyJ0eXAiOiJKV1QiLCJub25jZSI6InY1ejBZazJPaWxNVjVzYndpQTNPd0x3TWZFM0JPaEJOODh5LUJ0djl1S3ciLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8wY2VhMGFiNy0yMjM0LTRmNTctYmM4MC00ZDNlNjZkZjQ3OTEvIiwiaWF0IjoxNjcyODExNTQzLCJuYmYiOjE2NzI4MTE1NDMsImV4cCI6MTY3MjgxNTQ0MywiYWlvIjoiRTJaZ1lPaitjeWV5dmU2THJlaTB2cVFsK3lZa0FBQT0iLCJhcHBfZGlzcGxheW5hbWUiOiJCZWFjb25zdGFjIFFSIEludGVncmF0aW9uIEFQSSIsImFwcGlkIjoiNjQyMzQxOWQtY2QwMS00OWZkLWE3YzAtNjc3OWRlMTFmMjZkIiwiYXBwaWRhY3IiOiIxIiwiaWRwIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvMGNlYTBhYjctMjIzNC00ZjU3LWJjODAtNGQzZTY2ZGY0NzkxLyIsImlkdHlwIjoiYXBwIiwib2lkIjoiYTZhYTlkMDgtOTc4NS00NjVlLWI5MmMtNGNiNWRmNDYyODI1IiwicmgiOiIwLkFUd0F0d3JxRERRaVYwLThnRTAtWnQ5SGtRTUFBQUFBQUFBQXdBQUFBQUFBQUFBOEFBQS4iLCJyb2xlcyI6WyJTaXRlcy5TZWxlY3RlZCIsIlVzZXIuUmVhZFdyaXRlLkFsbCIsIk1haWwuU2VuZCJdLCJzdWIiOiJhNmFhOWQwOC05Nzg1LTQ2NWUtYjkyYy00Y2I1ZGY0NjI4MjUiLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiRVUiLCJ0aWQiOiIwY2VhMGFiNy0yMjM0LTRmNTctYmM4MC00ZDNlNjZkZjQ3OTEiLCJ1dGkiOiJ4VWs0REdOeVdVV1JhS0gwRXVkNEFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyIwOTk3YTFkMC0wZDFkLTRhY2ItYjQwOC1kNWNhNzMxMjFlOTAiXSwieG1zX3RjZHQiOjE1NzQyNTU2MDV9.WFcOk91-gtCXskmSCT5r3ytZrBVrDGrN_XA6704dVvvqPduLvzFFEU_o77U7goy6J4-n0wSh9dVFjT97IsIPfTi6se8_xCrty6_4tgKJbgAZ7dvoCsFHkK9SFddFFRQeMFCei4LaL-XJrfZxT4ywx5HF9nbGzJj5lywLMhdmbAhpxqdUWS1ooCH-cAsHxa-8vH3lvIooL6rJrSdLDcj6CoR4EMqE-fYG7WS_OJ2Dp1SIDSTJ7Zml0McAg5HrfLE8dnDHclF7E7YGazQRc9vEG5htjMEHWOSC89qnOfYWTSWm6EQ_oQp7CmHOvyXaikLqo13XOd3ZdFBqbe-A1rgSmA"
  const options = {
    'method': 'PATCH',
    'url': `https://graph.microsoft.com/v1.0/users/${userId}`,
    'headers': {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "onPremisesExtensionAttributes": {
        "extensionAttribute1": String(qrId)
      }
    })
  
  };
  return new Promise((resolve, reject) => {
      request(options, function (error, res, body) {
          if (!error && res.statusCode === 204) {
              resolve(`Successfully Updated User. ${body}`);
          } else {
              reject("errorrrr");
          }
      });
  })
}

const createNewQr = () => {
  const binaryData = qr.imageSync(`https://qr.bgmea.cloud/${generateQr["url"].split('/')[3]}`, { type: 'svg' });
}


const run = async () => {
  const users = JSON.parse(await getUsers());
  const gett = Promise.all(users.results.map(x => updateUser(x.campaign.vcard_plus.email, x.id).then((response) => {
    console.log(response)
  }).catch((err) => {
    console.log(x.name)
    console.log(err)
  })));
}

//run();




const {getUser, getToken, getQrUrl, getSvgBinary, getQr, getQrList} = require('../services/get');  
