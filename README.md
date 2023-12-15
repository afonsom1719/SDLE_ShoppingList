# Os Distribuídos

Please take note that this project is still in development and the current version serves only as a base for the future development.

## Project structure

The project is divided into two folders: client and server. The client folder contains the frontend code and the server folder contains the backend code.
The client folder is a react app and the server folder is a node.js app. The server folder also contains a nodemon.json file that contains the environment variables for the server.

## Requirements

- Node.js
- Yarn or npm
- MongoDB

## Installation steps

1. Get into the client folder and run `yarn install` or `npm i`
2. Then run `yarn start` or `npm start`
3. Do the same thing inside the server folder.
4. To run the indidual servers do: `node dist/js/serverX.js` (X being the number of the server with in our case is only 1 and 2)

> IMPORTANT: The nodemon.json file currently contains Eduardo Silva's credential to a temporary mongodb database. Later we will need to create one for the team.

## Branch methodology

The recommended branch methodology is the following:

- master/main: only for production code
- dev: for development code
- feature branches: for new features

Feature branches should be created from dev and merged back into dev. When a new major update or feature is good and dev branch contains a stable version, dev should be merged into master/main.
