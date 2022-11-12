

 

// import { ENCRYPTION_METHOD, ENCRYPTION_SECRET, PORT, SPOTIFY_CLIENT_CALLBACK, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@env';
// import { createServer, Response } from "miragejs"

// // init spotify config
// const spClientId = SPOTIFY_CLIENT_ID;
// const spClientSecret = SPOTIFY_CLIENT_SECRET;
// const spClientCallback = SPOTIFY_CLIENT_CALLBACK;
// const authString = Buffer.from(spClientId+':'+spClientSecret).toString('base64');
// const authHeader = `Basic ${authString}`;
// const spotifyEndpoint = 'https://accounts.spotify.com/api/token';

// export function makeServer() {
//   return createServer({
//     routes() {
//         this.passthrough('http://api.amazon.com/**')
//         this.post('/test'), () => {
//             return "test";
//         }
//         this.post('/swap', async (schema, request) => {
//             try {
//                 let attrs = JSON.parse(request.requestBody)

//                 console.log("SWAP");
//                 // build request data
//                 const reqData = {
//                     grant_type: 'authorization_code',
//                     redirect_uri: spClientCallback,
//                     code: attrs.body.code
//                 };
        
//                 // get new token from Spotify API
//                 const response = await fetch(spotifyEndpoint, {
//                     headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify(reqData)
//                 }).then(res => res.text())

//                 return response;
//             }
            
//             catch(error) {
//                 var code : number = error.response? error.response.statusCode: 500;
//                 var data = error.data? error.data : "";
//                 return new Response(code, undefined, data);
//             }
//         });

//         this.post('/refresh', async (schema, request) => {
//             try {
//                 let attrs = JSON.parse(request.requestBody)
//                 // ensure refresh token parameter
//                 if (!attrs.body.refresh_token) {
//                     return new Response(400, {}, {error: 'Refresh token is missing from body'});
//                 }

//                 // build request data
//                 const data = {
//                     grant_type: 'refresh_token',
//                     refresh_token: attrs.body.refresh_token
//                 };
//                 // get new token from Spotify API
//                 const response = await fetch(spotifyEndpoint, {
//                     headers: {
//                       'Accept': 'application/json',
//                       'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify(data)
//                 }).then(res => res.json());

//                 return response
//             }
//             catch(error) {
//                 var code : number = error.response? error.response.statusCode: 500;
//                 var data = error.data? error.data : "";
//                 return new Response(code, {}, data);
//             }
//         });
//     },
// })
// }