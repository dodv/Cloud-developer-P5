// QUESTIONBANK: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '1r7k32yfg4'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // QUESTIONBANK: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-4tvsbytxmz850fqt.us.auth0.com',            // Auth0 domain
  clientId: 'yVoX0VnU3dyIPGj8qBPhX75T9JlaJHm2',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
