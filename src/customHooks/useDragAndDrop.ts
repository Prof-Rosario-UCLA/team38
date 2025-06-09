import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const isLocal = false;

export const useDragAndDrop = (teams: any[], sportType: string) => {
  const [teamOrder, setTeamOrder] = useState<string[]>([]);
  const { user } = useAuth0();
  const userEmail: string = user?.email || '';

  //make a case switch statement for sportType
  let sportTypeString = "";
  switch (sportType) {
    case "nba":
      sportTypeString = "NBAFavorites";
      break;
    case "nfl":
      sportTypeString = "NFLFavorites";
      break;
    case "mlb":
      sportTypeString = "MLBFavorites";
      break;
  }

  useEffect(() => {
    const newTeams = teamOrder.map((id) => teams.find((t: any) => t.team.id === id).team.abbreviation);
    console.log("team order changed in useDragAndDrop");
    //save the newTeams to the database
    async function saveTeams() {
      await fetch(isLocal ? `http://localhost:8080/favorite-teams/${userEmail}/${sportTypeString}` : `https://cs144-25s-dhruvpareek12.uw.r.appspot.com/favorite-teams/${userEmail}/${sportTypeString}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ favorites: newTeams })
    });
    }
    saveTeams();
  }, [teamOrder]);

  useEffect(() => {
    if (teams.length > 0) {
      setTeamOrder(teams.map((t: any) => t.team.id));
    }
  }, [teams]);

  const onDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const onDrop = (e: React.DragEvent, dropId: string) => {
    const draggedId = e.dataTransfer.getData("text/plain");
    if (draggedId === dropId) return;

    const newOrder = [...teamOrder];
    const draggedIndex = newOrder.indexOf(draggedId);
    const dropIndex = newOrder.indexOf(dropId);

    newOrder.splice(draggedIndex, 1);
    newOrder.splice(dropIndex, 0, draggedId);
    setTeamOrder(newOrder);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return {
    teamOrder,
    setTeamOrder,
    onDragStart,
    onDrop,
    onDragOver,
  };
};
