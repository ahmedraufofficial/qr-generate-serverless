const {getUser, getToken, getQrUrl, getSvgBinary, getQr} = require('../services/get');  
const {postQr, postEmail} = require('../services/post');
const {putToSharepoint, putQr} = require('../services/put');
const {patchUser} = require('../services/patch')
const Buffer = require('buffer').Buffer;
var qr = require('node-qr-image');

module.exports = async function (context, req) {
    const APP_ID = '6423419d-cd01-49fd-a7c0-6779de11f26d';
    const APP_SECERET = 'RdG8Q~FHQ2zDB49RASF6BojmFuqwzu5FFiZahbBx';
    const TOKEN_ENDPOINT ='https://login.microsoftonline.com/0cea0ab7-2234-4f57-bc80-4d3e66df4791/oauth2/v2.0/token';
    const MS_GRAPH_SCOPE = 'https://graph.microsoft.com/.default';
    const BEACONSTAC_API_KEY = '1d13d7f54396e64b2464bf5e20ab9e9343ac44ff';
    const SHAREPOINT_SITE = 'https://graph.microsoft.com/v1.0/sites/94fe361b-d7b2-44f3-8be2-c151fb3c5c12/drives/b!Gzb-lLLX80SL4sFR-zxcEgR49EqCVvpCuWAdA6g3VYIYBVKPJiFhSJfIok0t8vk7/root:/Stationary/Access_Cards/QR_Codes_New';
    const APPLICATION_EMAIL = 'qr.sharepoint@bespinglobal.ae';
    const postData = {
      client_id: APP_ID,
      scope: MS_GRAPH_SCOPE,
      client_secret: APP_SECERET,
      grant_type: 'client_credentials'
    };

    if (req.query.validationToken) {
        context.log(req.query.validationToken);
        context.res = {
            headers: {
                'Content-Type': 'text/plain'
            },
            body: req.query.validationToken
        };
    }
    else {
        context.log(req.body)
        const userResource = req.body?.value[0]?.resource
        const userJSON = JSON.stringify(req.body?.value[0]?.resourceData)
        context.log(userJSON)
        const token = await getToken(TOKEN_ENDPOINT, postData)
        if (token && userResource) {
            try {
                const userData = JSON.parse(await getUser(token, userResource));
                if (userData.onPremisesExtensionAttributes.extensionAttribute1 != null){
                    context.log("Update function")
                    const userQr = JSON.parse(await getQr(userData.onPremisesExtensionAttributes.extensionAttribute1, BEACONSTAC_API_KEY))
                    const updateUser = await putQr(userData.onPremisesExtensionAttributes.extensionAttribute1, userData, userQr, BEACONSTAC_API_KEY)
                    updateUser ? context.log("Successfully updated user QR.") : context.log("Unable to update user QR.")
                } else {
                    context.log("Create function")
                    const generateQr = JSON.parse(await postQr(userData, BEACONSTAC_API_KEY));
                    const qrUrl = await getQrUrl(generateQr["id"], BEACONSTAC_API_KEY);
                    const fileName = JSON.parse(qrUrl)["name"]
                    //const binaryData = await getSvgBinary(JSON.parse(qrUrl)["urls"]["svg"])
                    const binaryData = qr.imageSync(`https://qr.bgmea.cloud/${generateQr["url"].split('/')[3]}`, { size: 15, type: 'svg' });
                    const uploadSvg = await putToSharepoint(binaryData, SHAREPOINT_SITE, fileName, token)
                    uploadSvg ? context.log("Uploaded to Sharepoint successfully") : context.log("Unable to upload on Sharepoint")
                    const imageBase64 = Buffer.from(binaryData).toString('base64')
                    const updateUser = await patchUser(token, userResource, generateQr["id"])
                    updateUser ? context.log("Updated user AD profile") : context.log("Unable to update user AD profile")
                    const sendEmail = await postEmail(APPLICATION_EMAIL, fileName, userData?.displayName, imageBase64, token)
                    sendEmail ? context.log("Email successfully sent") : context.log("Email failed to be sent")
                }
            } catch (error) {
                context.log(error);
            }
        } 
        context.res = {
            body: ""
        };
    }
}

/*
{"value":[{"changeType":"updated","clientState":"secretClientValue","resource":"Users/72b08237-30f1-4fbe-be57-1df593448f7a","resourceData":{"@odata.type":"#Microsoft.Graph.User","@odata.id":"Users/72b08237-30f1-4fbe-be57-1df593448f7a","id":"72b08237-30f1-4fbe-be57-1df593448f7a","organizationId":"0cea0ab7-2234-4f57-bc80-4d3e66df4791","sequenceNumber":638059995676961300},"subscriptionExpirationDateTime":"2022-12-10T10:23:45.9356913-08:00","subscriptionId":"f43589a8-2107-4c5d-9c24-eea6301f162b","tenantId":"0cea0ab7-2234-4f57-bc80-4d3e66df4791"}]}
*/
