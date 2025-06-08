# React + TypeScript + Vite


MaterialUI being used for styling: https://mui.com/material-ui/getting-started/
`npm install @mui/material @emotion/react @emotion/styled`

- Whenever you update anything related to API's, must run `tsc` to compile the typescript code into javascript code then run `npm start` to start the server in backend/express-api

Deploying to App Engine:
`gcloud app deploy --version X`  
To look at logs:
`gcloud app logs tail -s default`

To run project Locally:
-In useFetchFavTeams.tsx, change isLocal to true to run locally
-In SelectTeams.tsx, change isLocal to true to run locally
-backend/express-api/.env uncomment the local section and comment the production section
`npm install` then to run Express API routes and Frontend: `npm start` in root directory
-To run the database, `cd backend/DynamoDB_local_latest` then `java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb`



EXAMPLE BROWSER REQUEST:
http://localhost:3000/favorite-teams/
http://localhost:3000/favorite-teams/user123
`curl -X POST -H "Content-Type: application/json" -d '{"favorites": ["MIN"]}' http://localhost:3000/favorite-Teams/user123/NBAFavorites`
`aws dynamodb put-item \ --table-name FavoriteTeams \ --item '{ "UserID": {"S": "user123"}, "NFLFavorites": {"SS": ["ARI", "NE"]}, "NBAFavorites": {"SS": ["LAL", "BOS"]}, "MLBFavorites": {"SS": ["NYM", "LAD"]} }' \ --endpoint-url http://localhost:8000 \ --region us-west-1`
`curl -X DELETE http://localhost:3000/favorite-teams/user123`
`curl -X POST http://localhost:3000/favorite-teams \
  -H "Content-Type: application/json" \
  -d '{
    "UserID": "dhruvpareek883@gmail.com",
    "NFLFavorites": ["ARI", "NE"],
    "NBAFavorites": ["LAL", "BOS"],
    "MLBFavorites": ["NYM", "LAD"]
  }'`

`curl -X GET http://localhost:3000/favorite-teams/user123`

Current API Being used to Load Teams: https://gist.github.com/bhaidar/b2fdd34004250932a4a354a2cc15ddd4

-Two things we need to remember the entire time is that the webapp must be a single page type of thing with no vertical or horizontal scrolling and that the webapp must be responsive to different screen sizes like project 1.
