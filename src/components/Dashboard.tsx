import { useAuth0 } from "@auth0/auth0-react";
import useFetchFavTeams from "./customHooks/useFetchFavTeams";
import React from "react";
import { useState } from "react";

const Dashboard = () => {
  const { user } = useAuth0();
  const { teamsBySport, loading, error } = useFetchFavTeams(user?.email);
  if (!user) {
    return <p>Please login to view your favorite teams</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const { NFLFavorites = [], NBAFavorites = [], MLBFavorites = [] } = teamsBySport;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your sports dashboard!</p>
      <p>NFL Favorites: {NFLFavorites.join(", ")}</p>
      <p>NBA Favorites: {NBAFavorites.join(", ")}</p>
      <p>MLB Favorites: {MLBFavorites.join(", ")}</p>
    </div>
  );
};

export default Dashboard; 