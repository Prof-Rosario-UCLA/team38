import { Router, Request, Response, RequestHandler } from "express";
import { ddbDocClient } from "../dynamoClient";
import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { NFLTeams, NBATeams, MLBTeams } from "./teams";

const TABLE = "FavoriteTeams";
const router = Router();

interface Favorites {
  UserID: string;
  NFLFavorites?: string[];
  NBAFavorites?: string[];
  MLBFavorites?: string[];
}

type SportType = "NFLFavorites" | "NBAFavorites" | "MLBFavorites";

interface UpdateFavoritesBody {
  sport: SportType;
  add?: string[];
  remove?: string[];
}

interface UpdateSportFavoritesBody {
  favorites: string[];
}

// 1. List all users (scan)
router.get("/", async (req: Request, res: Response) => {
  const data = await ddbDocClient.send(new ScanCommand({ TableName: TABLE }));
  res.json(data.Items);
});

// 2. Get one user's favorites
router.get("/:userId", (async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await ddbDocClient.send(
    new GetCommand({
      TableName: TABLE,
      Key: { UserID: userId },
    })
  );
  if (!result.Item) return res.status(404).json({ error: "Not found" });
  res.json(result.Item);
}) as RequestHandler);

// 3. Create or overwrite a user's favorites across all sports
router.post("/", async (req: Request, res: Response) => {
  const item = req.body as Favorites;
  if (item.NFLFavorites) {
    const invalidNFLTeams = item.NFLFavorites.filter(
      (team) => !NFLTeams.includes(team)
    );
    if (invalidNFLTeams.length > 0) {
      res
        .status(400)
        .json({ error: `Invalid NFL teams: ${invalidNFLTeams.join(", ")}` });
      return;
    }
  }
  if (item.NBAFavorites) {
    const invalidNBATeams = item.NBAFavorites.filter(
      (team) => !NBATeams.includes(team.trim().toUpperCase())
    );
    if (invalidNBATeams.length > 0) {
      res
        .status(400)
        .json({ error: `Invalid NBA teams: ${invalidNBATeams.join(", ")}` });
      return;
    }
  }
  if (item.MLBFavorites) {
    const invalidMLBTeams = item.MLBFavorites.filter(
      (team) => !MLBTeams.includes(team)
    );
    if (invalidMLBTeams.length > 0) {
      res
        .status(400)
        .json({ error: `Invalid MLB teams: ${invalidMLBTeams.join(", ")}` });
      return;
    }
  }

  await ddbDocClient.send(
    new PutCommand({
      TableName: TABLE,
      Item: item,
    })
  );
  res.status(201).json(item);
});

// 4. Create or overwrite a user's favorites for a specific sport
router.post("/:userId/:sport", (async (req: Request, res: Response) => {
  const { userId, sport } = req.params as { userId: string; sport: SportType };
  const { favorites } = req.body as UpdateSportFavoritesBody;

  if (!["NFLFavorites", "NBAFavorites", "MLBFavorites"].includes(sport)) {
    return res.status(400).json({ error: "Invalid sport specified" });
  }

  if (sport === "NFLFavorites") {
    const invalidNFLTeams = favorites.filter(
      (team) => !NFLTeams.includes(team)
    );
    if (invalidNFLTeams.length > 0) {
      res
        .status(400)
        .json({ error: `Invalid NFL teams: ${invalidNFLTeams.join(", ")}` });
      return;
    }
  } else if (sport === "NBAFavorites") {
    const invalidNBATeams = favorites.filter(
      (team) => !NBATeams.includes(team)
    );
    if (invalidNBATeams.length > 0) {
      res
        .status(400)
        .json({ error: `Invalid NBA teams: ${invalidNBATeams.join(", ")}` });
      return;
    }
  } else if (sport === "MLBFavorites") {
    const invalidMLBTeams = favorites.filter(
      (team) => !MLBTeams.includes(team)
    );
    if (invalidMLBTeams.length > 0) {
      res
        .status(400)
        .json({ error: `Invalid MLB teams: ${invalidMLBTeams.join(", ")}` });
      return;
    }
  }

  const params = {
    TableName: TABLE,
    Key: { UserID: userId },
    UpdateExpression: `SET #sportAttribute = :favs`,
    ExpressionAttributeNames: {
      "#sportAttribute": sport,
    },
    ExpressionAttributeValues: {
      ":favs": favorites,
    },
    ReturnValues: "ALL_NEW" as const,
  };

  try {
    const getUser = await ddbDocClient.send(
      new GetCommand({ TableName: TABLE, Key: { UserID: userId } })
    );

    if (getUser.Item) {
      const result = await ddbDocClient.send(new UpdateCommand(params));
      res.status(200).json(result.Attributes);
    } else {
      const newItem = {
        UserID: userId,
        [sport]: favorites,
      };
      await ddbDocClient.send(
        new PutCommand({
          TableName: TABLE,
          Item: newItem,
        })
      );
      res.status(201).json(newItem);
    }
  } catch (error) {
    console.error("Error updating/creating favorites:", error);
    res.status(500).json({ error: "Could not update or create favorites" });
  }
}) as RequestHandler);

// 5. Delete a user completely
router.delete( "/:userId", async (req: Request<{ userId: string }>, res: Response) => {
    await ddbDocClient.send(
      new DeleteCommand({
        TableName: TABLE,
        Key: { UserID: req.params.userId },
      })
    );
    res.status(204).end();
  }
);

export default router;
