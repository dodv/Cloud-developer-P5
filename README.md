# Cloud-developer-P5
#Prerequisites
	AWS account configure
	Auth0 account
	GitHub account
	NodeJS version up to 12.xx
	Serverless
		Create a Serverless account user
		Install the Serverless Framework’s CLI
			npm install -g serverless@2.21.1
			serverless --version


	- Login to the Auth0 portal, and navigate to your Dashboard.
	Create a "Single Page Web Applications" type Auth0 application
	Go to the App settings, 
	and setup the Allowed Callback URLs = 'http://localhost:3000/callback'
	Setup the Allowed Web Origins ='http://localhost:3000/'.
	Setup the application properties. 
	Copy "domain" and "client id" to save in the /client/src/config.ts file.
	In your backend auth handler function, fetch the Auth0 certificate programmatically.
	user Application/advance/settings/Oauth/ JSON Web Key Set set to jwksUrl in .backend\src\lambda\auth\auth0Authorizer.ts

Edit the /client/src/config.ts file to configure your Auth0 client application and API endpoint.

Clone this Repository then run commands below like ordered:
		
cd backend
npm update --save
npm audit fix

sls login
# For the first time, create an application in your org in Serverless portal
sls
# Next time, deploy the app and note the endpoint url in the end
sls deploy --verbose
# If you face a permissions error, you may need to specify the user profile
sls deploy -v --aws-profile serverless
# sls is shorthand for serverless
# -v is shorthand for --verbose


RUN The Frontend

cd client
npm update --save
npm audit fix --legacy-peer-deps
npm install --save-dev
npm run start
This should start a React development server at http://localhost:3000/ that will interact with the backend APIs.




