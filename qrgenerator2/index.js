const {getUser, getToken, getQrUrl, getSvgBinary, getQr, getDelta, getSPImageNameAndUrl, getAWStoken, getDeltaBeta, getSPImageBinary} = require('../services/get');  
const {postQr, postEmail, postBeaconStacForm} = require('../services/post');
const {putToSharepoint, putQr, putImageVisibilty} = require('../services/put');
const {patchUser} = require('../services/patch');
const {getDeltaToken, postDeltaToken} = require('../services/fileAction');
const Buffer = require('buffer').Buffer;
const {XMLParser} = require("fast-xml-parser");
var qr = require('node-qr-image');

module.exports = async function (context, req) {
    const APP_ID = '6423419d-cd01-49fd-a7c0-6779de11f26d';
    const APP_SECERET = 'RdG8Q~FHQ2zDB49RASF6BojmFuqwzu5FFiZahbBx';
    const TOKEN_ENDPOINT ='https://login.microsoftonline.com/0cea0ab7-2234-4f57-bc80-4d3e66df4791/oauth2/v2.0/token';
    const MS_GRAPH_SCOPE = 'https://graph.microsoft.com/.default';
    const BEACONSTAC_API_KEY = '1d13d7f54396e64b2464bf5e20ab9e9343ac44ff';
    const SHAREPOINT_SITE = 'https://graph.microsoft.com/v1.0/sites/94fe361b-d7b2-44f3-8be2-c151fb3c5c12/drives/b!Gzb-lLLX80SL4sFR-zxcEgR49EqCVvpCuWAdA6g3VYIYBVKPJiFhSJfIok0t8vk7/root:/Stationary/Access_Cards/QR_Codes_New';
    const APPLICATION_EMAIL = 'qr.sharepoint@bespinglobal.ae';
    const TOKEN_FILE = `${process.cwd()}/static/token.json`;
    const BETA_LIST = 'https://graph.microsoft.com/beta/sites/94fe361b-d7b2-44f3-8be2-c151fb3c5c12/Lists/f111eca3-ca2f-4680-b54c-ed4a93926db9'
    const BEACONSTAC_ORGANIZATION = 116496;
    const BEACONSTAC_FOLDER = 352414;
    const postData = {
      client_id: APP_ID,
      scope: MS_GRAPH_SCOPE,
      client_secret: APP_SECERET,
      grant_type: 'client_credentials'
    };

    const SHAREPOINT_APP_ID = '436eb3f6-3ba6-424c-8f56-349ccc2f9a15@0cea0ab7-2234-4f57-bc80-4d3e66df4791';
    const SHAREPOINT_APP_SECERET = '/P2JY24jIqX60GPwxl084cytfJfd3dbIjOE2wtIIUB8=';
    const SHAREPOINT_TOKEN_ENDPOINT ='https://accounts.accesscontrol.windows.net/0cea0ab7-2234-4f57-bc80-4d3e66df4791/tokens/oAuth/2';
    const SHAREPOINT_RESOURCE = '00000003-0000-0ff1-ce00-000000000000/bespinglobalmea.sharepoint.com@0cea0ab7-2234-4f57-bc80-4d3e66df4791';
    const SHAREPOINT_LIST = `https://bespinglobalmea.sharepoint.com/sites/Marketing/_api/web/Lists(guid'f111eca3-ca2f-4680-b54c-ed4a93926db9')`;
    const SHAREPOINT_RELATIVE_PATH = `https://bespinglobalmea.sharepoint.com/sites/Marketing/_api/Web/GetFileByServerRelativePath(decodedurl='%s/%s')/$value`;
    const SHAREPOINT_LIST_PATH = '/sites/Marketing/AD User Images';
    const sharepointPostData = {
      client_id: SHAREPOINT_APP_ID,
      resource: SHAREPOINT_RESOURCE,
      client_secret: SHAREPOINT_APP_SECERET,
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
    else if (req.query.validationtoken) {
        context.log(req.query.validationtoken);
        context.res = {
            headers: {
                'Content-Type': 'text/plain'
            },
            body: req.query.validationtoken
        };
    }
    else if (req.body?.value[0]?.clientState == "sharepointResource") {
        context.log(req.body)
        const token = await getToken(SHAREPOINT_TOKEN_ENDPOINT, sharepointPostData)
        const graphToken = await getToken(TOKEN_ENDPOINT, postData)
        const deltaToken = JSON.parse(await getDeltaToken(TOKEN_FILE))
        const getResourceChanges = JSON.parse(await getDeltaBeta(graphToken, BETA_LIST, deltaToken))
        context.log(getResourceChanges)
        const getNewToken = new URL(getResourceChanges["@odata.deltaLink"]).searchParams.get('token')
        postDeltaToken(TOKEN_FILE, getNewToken)
        const allImages = getResourceChanges.value.map(async (image) => {
            if (image.webUrl) {
                const imageName = decodeURIComponent(image.webUrl).split('/').pop()
                const imageBinary = await getSPImageBinary(token, SHAREPOINT_RELATIVE_PATH, SHAREPOINT_LIST_PATH, imageName)
                const imageBuffer = Buffer.from(imageBinary, 'binary')
                const keys = JSON.parse(await getAWStoken(BEACONSTAC_ORGANIZATION, BEACONSTAC_FOLDER, BEACONSTAC_API_KEY));
                const uploadToBeaconStac = await postBeaconStacForm(keys, imageBuffer, imageName)
                if (uploadToBeaconStac) {
                    const displayOnBeaconStac = JSON.parse(await putImageVisibilty(keys.id, imageName, BEACONSTAC_API_KEY))
                    console.log(displayOnBeaconStac.name)
                    const userData = JSON.parse(await getUser(graphToken, `Users/${displayOnBeaconStac.name.replace('.jpg','').replace('.png','').replace('.jpeg','')}`));
                    console.log(userData)
                    if (userData.onPremisesExtensionAttributes.extensionAttribute1 != null){
                        console.log("Update function")
                        const userQr = JSON.parse(await getQr(userData.onPremisesExtensionAttributes.extensionAttribute1, BEACONSTAC_API_KEY))
                        userData.user_image_url = keys.media_url
                        const updateUser = await putQr(userData.onPremisesExtensionAttributes.extensionAttribute1, userData, userQr, BEACONSTAC_API_KEY)
                        updateUser ? console.log("Successfully updated user QR.") : console.log("Unable to update user QR.")
                    }
                }
            }  
        })
        Promise.all(allImages).then((result) => {
            context.res = {
                body: "",
            };
        }).catch((err) => {
            context.res = {
                body: "Error: " + err,
            };
        });
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
                    const updateUser = await patchUser(token, userResource, generateQr["id"])
                    updateUser ? context.log("Updated user AD profile") : context.log("Unable to update user AD profile")
                    const qrUrl = await getQrUrl(generateQr["id"], BEACONSTAC_API_KEY);
                    const fileName = JSON.parse(qrUrl)["name"]
                    //const binaryData = await getSvgBinary(JSON.parse(qrUrl)["urls"]["svg"])
                    const binaryData = qr.imageSync(`https://qr.bgmea.cloud/${generateQr["url"].split('/')[3]}`, { size: 15, type: 'svg' });
                    const uploadSvg = await putToSharepoint(binaryData, SHAREPOINT_SITE, fileName, token)
                    uploadSvg ? context.log("Uploaded to Sharepoint successfully") : context.log("Unable to upload on Sharepoint")
                    const imageBase64 = Buffer.from(binaryData).toString('base64')
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
