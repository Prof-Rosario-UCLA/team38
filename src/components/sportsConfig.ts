import SportsFootballIcon from "@mui/icons-material/SportsFootball";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import SportsBaseballIcon from "@mui/icons-material/SportsBaseball";

export const sports = [
  { label: "NBA", icon: SportsBasketballIcon, favorites: "NBAFavorites" },
  { label: "NFL", icon: SportsFootballIcon, favorites: "NFLFavorites" },
  { label: "MLB", icon: SportsBaseballIcon, favorites: "MLBFavorites" },
];

export const sportMappings = {
  sports: ["basketball", "football", "baseball"],
  leagues: ["nba", "nfl", "mlb"],
  favorites: ["NBAFavorites", "NFLFavorites", "MLBFavorites"],
};
