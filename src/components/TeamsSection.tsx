import React, { useState } from 'react';
import { TeamCard } from './TeamCard';
import { TeamDialog } from './TeamDialog';
import { useDragAndDrop } from '../customHooks/useDragAndDrop';
import useFetchTeamDetails from '../customHooks/useFetchTeamDetails';
import useScoreboardData from '../customHooks/useScoreboardData';
import useFetchFavTeams from '../customHooks/useFetchFavTeams';

interface TeamsSectionProps {
  currentSport: 'basketball' | 'football' | 'baseball';
  currentLeague: 'nba' | 'nfl' | 'mlb';
  userEmail: string | undefined;
  selectedTab: number;
}

export const TeamsSection: React.FC<TeamsSectionProps> = ({
  currentSport,
  currentLeague,
  userEmail,
  selectedTab
}) => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [open, setOpen] = useState(false);
  // Fetch favorite teams
  const { teamsBySport, loading: loadingFavTeams, error: errorFavTeams } = useFetchFavTeams(userEmail);
  const { NBAFavorites = [], NFLFavorites = [], MLBFavorites = [] } = teamsBySport;
  const currentFavs = [NBAFavorites, NFLFavorites, MLBFavorites][selectedTab];
  
  // Fetch data using the hooks that were previously in Dashboard
  const { data: teams, loading: teamsLoading, error: teamsError } = useFetchTeamDetails(
    currentSport,
    currentLeague,
    currentFavs
  );

  const { data: scoreboardEvents } = useScoreboardData(
    currentSport,
    currentLeague
  );
  
  const {
    teamOrder,
    onDragStart,
    onDrop,
    onDragOver
  } = useDragAndDrop(teams, currentLeague);

  const formatFutureGame = (isoString: string | undefined): string => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getGameInfo = (team: any): React.ReactNode => {
    const event = team.team?.nextEvent?.[0]?.competitions?.[0];
    const state = event?.status?.type?.state;
    let liveEvent = null;
    
    if (state === 'in') {
      liveEvent = scoreboardEvents?.find((e: any) => e.id === event.id);  
    }

    if (state === 'post') {
      return (
        <>
          Recent Game: {""}
          {event?.competitors?.map((c: any, i: number) => (
            <strong key={i}>
              {c.team?.abbreviation} {c.score?.displayValue || "N/A"}
              {i === 0 ? " vs " : ""}
            </strong>
          ))}
        </>
      );
    }

    if (state === 'in') {
      return (
        <>
          {liveEvent?.competitions?.[0].competitors?.map((c: any, i: number) => (
            <span key={i}>
              {c.team?.abbreviation} {c.score || "0"}
              {i === 0 ? " vs " : ""}
            </span>
          ))}
          <br />
          <strong>In Progress:</strong> {event?.status?.type?.shortDetail}
        </>
      );
    }

    if (state === 'pre') {
      return (
        <>
          Next Game: <strong>{team.team.nextEvent?.[0]?.shortName}</strong><br />
          {formatFutureGame(event?.date)}
        </>
      );
    }
    return <strong>No upcoming games</strong>;
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTeam(null);
  };

  if (loadingFavTeams) return <p>Loading favorite teams...</p>;
  if (errorFavTeams) return <p>Error loading favorites: {errorFavTeams}</p>;
  if (teamsLoading) return <p>Loading {currentLeague.toUpperCase()} teams...</p>;
  if (teamsError) return <p>Error: {teamsError}</p>;
  if (!teams.length) return <p>No favorite teams for {currentLeague.toUpperCase()}, select some on the "Select Teams" page</p>;

  return (
    <section className="dashboard-section">
      {teamOrder.map((id) => {
        const team = teams.find((t: any) => t.team.id === id);
        if (!team) return null;

        return (
          <TeamCard
            key={team.team.id}
            team={team}
            onDragStart={onDragStart}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onClick={() => {
              setSelectedTeam(team);
              setOpen(true);
            }}
            getGameInfo={getGameInfo}
          />
        );
      })}
      <TeamDialog
        open={open}
        onClose={handleClose}
        team={selectedTeam}
        getGameInfo={getGameInfo}
      />
    </section>
  );
};