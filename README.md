# My Team Tracker

This project is a simple WebApp that allowes users to easily track their favorite teams in the NFL, NBA, and MLB.
ESPN is the most common app that people use to track their favorite teams, but it is not very user friendly, has a lot of ads, and has become very cluttered.
The goal of this project is to create a simple, user friendly, and lightweight app that allows users to easily track their favorite teams on a single page.
The app is built using React, TypeScript, and Vite.
The backend is built using ExpressJS and NodeJS.
The database is built using DynamoDB.
The app is deployed to Google App Engine.
The app is hosted at https://cs144-25s-dhruvpareek12.uw.r.appspot.com/

## To run the project locally:
- One thing to note is that the Auth0 project I created requires me to set valid callback urls in the Auth0 dashboard.
  - The allowed callback urls are: http://localhost:5173, http://localhost:8080, https://cs144-25s-dhruvpareek12.uw.r.appspot.com/, https://cs144-25s-team38.et.r.appspot.com/
  - If you run the project locally and deploy the frontend to a different port than 5173 or 8080, you won't be able to login.

- The files /src/components/SelectTeams.tsx, /src/customHooks/useDragAndDrop.tsx, /src/customHooks/useFetchFavTeams.tsx have a variable called isLocal that is set to true when running the frontend/express server locally. This is used to determine whether to use the local express server or the deployed express server at the deployed URL vs localhost:8080.

- Run `npm install` to install the dependencies in the root directory and then run it again in the backend/express-api directory.

When the frontend and express server are running locally, you can either use the deployed dynamodb table or run the local dynamodb server.
<br>
  ** Use the local dynamodb server for development. **
  - `cd backend/express-api` and open the .env file. Uncomment the local section and comment the production section. (I know that env files are not supposed to be committed to github, but for you guys to run the project locally, I had to commit it and there are very restrictive/minimal perms for the user associated with the keys in the env file)
  - Run `tsc` to compile the typescript code into javascript code.
  - Run `cd ../DynamoDB_local_latest` then `java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb` to start the database on port 8000.

  **Use the deployed dynamodb server for production.**
  - cd backend/express-api and open the .env file. Uncomment the production section and comment the local section.
  - Run `tsc` to compile the typescript code into javascript code.


- Run `npm run build` in the home directory to build the project. It is important to rebuild this project everytime you make a change to the frontend or backend so that the changes are reflected.
- Run `npm run start` in the home directory to start the project. This will run the express api and the frontend on port 8080.

## To deploy the project:
- In the files /src/components/SelectTeams.tsx, /src/customHooks/useDragAndDrop.tsx, /src/customHooks/useFetchFavTeams.tsx change isLocal to false. This is used to determine whether to use the local express server or the deployed express server at the deployed URL vs localhost:8080. If you are deploying the webapp to a different URL than what is in the axios calls in those files, you will need to modify that too.
- Auth0 is used for authentication. The Auth0 credentials I configured in src/main.tsx point to an Auth0 project I created and specified the allowed callback urls in the Auth0 dashboard to http://localhost:5173, http://localhost:8080, https://cs144-25s-dhruvpareek12.uw.r.appspot.com/, https://cs144-25s-team38.et.r.appspot.com/. So if you deploy the webapp at a different URL than where we deployed the webapp and configured the allowed callback URL to, you will need to modify the Auth0 credentials in src/main.tsx to a new a Auth0 project you create where you allow the newly deployed URL to be a valid callback URL.
- The Cors configuration in backend/express-api/src/index.ts is used to allow the frontend to access the express api. If you are deploying the webapp to a different URL than what is in the cors configuration, you will need to modify that too by adding the new URL to the cors configuration.
- To deploy the project to Google App Engine run:
`gcloud app deploy --version X`  
- To look at logs:
`gcloud app logs tail -s default`

Since there are some difficulties relating to Auth0 and CORS with you guys deploying the project, you guys can use the deployed the project to Google App Engine at this URL and we won't take it down until grading is done: https://cs144-25s-dhruvpareek12.uw.r.appspot.com/


## REST API ENDPOINTS:
1. List all users (scan)
router.get("/", async (req: Request, res: Response) => {
http://localhost:8080/favorite-teams/
- CURL COMMAND: `curl -X GET http://localhost:8080/favorite-teams/`
- Returns the entire table of users and their favorite teams.

2. Get one user's favorites
router.get("/:userId", (async (req: Request, res: Response) => {
http://localhost:8080/favorite-teams/user123
- CURL COMMAND: `curl -X GET http://localhost:8080/favorite-teams/user123`
- Returns the favorite teams for the user with ID user123.

3. Create or overwrite a user's favorites across all sports
http://localhost:8080/favorite-teams/
router.post("/", async (req: Request, res: Response) => {
- CURL COMMAND: ``curl -X POST http://localhost:3000/favorite-teams -H "Content-Type: application/json" -d '{ "UserID": "dhruvpareek883@gmail.com", "NFLFavorites": ["ARI", "NE"], "NBAFavorites": ["LAL", "BOS"], "MLBFavorites": ["NYM", "LAD"] }'`
- Creates or overwrites the user's favorite teams across all sports.

4. Create or overwrite a user's favorites for a specific sport
http://localhost:8080/favorite-teams/user123/NBAFavorites
router.post("/:userId/:sport", (async (req: Request, res: Response) => {
- CURL COMMAND: `curl -X POST http://localhost:8080/favorite-teams/user123/NBAFavorites -H "Content-Type: application/json" -d '{"favorites": ["LAL", "BOS"]}'`
- Creates or overwrites the user's favorite teams for the sport NBAFavorites to ["LAL", "BOS"].

5. Delete a user completely
http://localhost:8080/favorite-teams/user123
router.delete( "/:userId", async (req: Request<{ userId: string }>, res: Response) => {
- CURL COMMAND: `curl -X DELETE http://localhost:8080/favorite-teams/user123`
- Deletes the user with ID user123.

<br><br><br>

ESPN API Being used to Load Teams: https://gist.github.com/bhaidar/b2fdd34004250932a4a354a2cc15ddd4