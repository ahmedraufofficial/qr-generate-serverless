const {getUser, getToken, getQrUrl, getSvgBinary} = require('../services/get');  
const {postQr, postToSharepoint} = require('../services/post');

module.exports = async function (context, req) {
    const APP_ID = '6423419d-cd01-49fd-a7c0-6779de11f26d';
    const APP_SECERET = 'RdG8Q~FHQ2zDB49RASF6BojmFuqwzu5FFiZahbBx';
    const TOKEN_ENDPOINT ='https://login.microsoftonline.com/0cea0ab7-2234-4f57-bc80-4d3e66df4791/oauth2/v2.0/token';
    const MS_GRAPH_SCOPE = 'https://graph.microsoft.com/.default';
    const BEACONSTAC_API_KEY = '1d13d7f54396e64b2464bf5e20ab9e9343ac44ff';
    const SHAREPOINT_SITE = 'https://graph.microsoft.com/v1.0/sites/94fe361b-d7b2-44f3-8be2-c151fb3c5c12/drives/b!Gzb-lLLX80SL4sFR-zxcEgR49EqCVvpCuWAdA6g3VYIYBVKPJiFhSJfIok0t8vk7/root:/Stationary/Access_Cards/QR code'
    const postData = {
      client_id: APP_ID,
      scope: MS_GRAPH_SCOPE,
      client_secret: APP_SECERET,
      grant_type: 'client_credentials'
    };
    
    let token = '';

    token = await getToken(TOKEN_ENDPOINT, postData)

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
        const responseMessage = JSON.stringify(req.body?.value[0]?.resource)
        if (token && responseMessage) {
            try {
                const userData = await getUser(token, responseMessage);
                const generateQr = await postQr(JSON.parse(userData), BEACONSTAC_API_KEY);
                const qrUrl = await getQrUrl(JSON.parse(generateQr)["id"], BEACONSTAC_API_KEY);
                const binaryData = await getSvgBinary(JSON.parse(qrUrl)["urls"]["svg"])
                const uploadSvg = await postToSharepoint(binaryData, SHAREPOINT_SITE, JSON.parse(qrUrl)["name"], token)
                if (uploadSvg) {
                    context.log("Executed Succesfully")
                }
            } catch (error) {
                context.log(error);
            }
        } 
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: ""
        };
    }
}

/*
{"value":[{"changeType":"updated","clientState":"secretClientValue","resource":"Users/72b08237-30f1-4fbe-be57-1df593448f7a","resourceData":{"@odata.type":"#Microsoft.Graph.User","@odata.id":"Users/72b08237-30f1-4fbe-be57-1df593448f7a","id":"72b08237-30f1-4fbe-be57-1df593448f7a","organizationId":"0cea0ab7-2234-4f57-bc80-4d3e66df4791","sequenceNumber":638059995676961300},"subscriptionExpirationDateTime":"2022-12-10T10:23:45.9356913-08:00","subscriptionId":"f43589a8-2107-4c5d-9c24-eea6301f162b","tenantId":"0cea0ab7-2234-4f57-bc80-4d3e66df4791"}]}
*/