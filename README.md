# React + TypeScript + Vite

To run the project, run `npm install` and then `npm run dev`, then go to `http://localhost:5173/`.

`npm run dev` takes a while to start for some reason and opening the page takes a while, so we need to figure that out


MaterialUI being used for styling: https://mui.com/material-ui/getting-started/
`npm install @mui/material @emotion/react @emotion/styled`

To run the database, `cd backend/DynamoDB_local_latest` then `java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb`

To run express server's api's, `cd backend/express-api` then `npm install` and then `npm start`
- Whenever you update anything related to API's, must run `tsc` to compile the typescript code into javascript code then run `npm start` to start the server

EXAMPLE BROWSER REQUEST:
http://localhost:3000/favorite-teams/
http://localhost:3000/favorite-teams/user123
`curl -X POST -H "Content-Type: application/json" -d '{"favorites": ["MIN"]}' http://localhost:3000/favorite-Teams/user123/NBAFavorites`
`aws dynamodb put-item \ --table-name FavoriteTeams \ --item '{ "UserID": {"S": "user123"}, "NFLFavorites": {"SS": ["ARI", "NE"]}, "NBAFavorites": {"SS": ["LAL", "BOS"]}, "MLBFavorites": {"SS": ["NYM", "LAD"]} }' \ --endpoint-url http://localhost:8000 \ --region us-west-1`
`curl -X DELETE http://localhost:3000/favorite-teams/user123`
`curl -X POST http://localhost:3000/favorite-teams \          
  -H "Content-Type: application/json" \
  -d '{
    "UserID": "user123",  
    "NFLFavorites": ["ARI", "NE"],
    "NBAFavorites": ["LAL", "BOS"],
    "MLBFavorites": ["NYM", "LAD"]
  }'`

`curl -X GET http://localhost:3000/favorite-teams/user123`

Current API Being used to Load Teams: https://gist.github.com/bhaidar/b2fdd34004250932a4a354a2cc15ddd4

-Two things we need to remember the entire time is that the webapp must be a single page type of thing with no vertical or horizontal scrolling and that the webapp must be responsive to different screen sizes like project 1.
