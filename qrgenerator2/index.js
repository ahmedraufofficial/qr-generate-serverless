module.exports = async function (context, req) {
    const APP_ID = '6423419d-cd01-49fd-a7c0-6779de11f26d';
    const APP_SECERET = 'RdG8Q~FHQ2zDB49RASF6BojmFuqwzu5FFiZahbBx';
    const TOKEN_ENDPOINT ='https://login.microsoftonline.com/0cea0ab7-2234-4f57-bc80-4d3e66df4791/oauth2/v2.0/token';
    const MS_GRAPH_SCOPE = 'https://graph.microsoft.com/.default';

    const axios = require('axios');
    const qs = require('qs');
    
    const postData = {
      client_id: APP_ID,
      scope: MS_GRAPH_SCOPE,
      client_secret: APP_SECERET,
      grant_type: 'client_credentials'
    };
    
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    
    let token = '';
    
    await axios.post(TOKEN_ENDPOINT, qs.stringify(postData))
      .then(response => {
        //context.log(response.data);
        token = response.data?.access_token
      })
      .catch(error => {
        context.log(error);
    });




    if (token) {
        const options = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    
        console.log('request made to web API at: ' + new Date().toString());
    
        try {
            const response = await axios.get('https://graph.microsoft.com/v1.0/users', options);
            console.log(response.data)
        } catch (error) {
            console.log(error)
        }
    } 

    context.log('JavaScript HTTP trigger function processed a request.');

    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}