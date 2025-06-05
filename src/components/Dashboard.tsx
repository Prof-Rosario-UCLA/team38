import { useAuth0 } from "@auth0/auth0-react";
import useFetchFavTeams from "./customHooks/useFetchFavTeams";
import useScoreboardData from "./customHooks/useScoreboardData";
import useFetchTeamDetails from "./customHooks/useFetchTeamDetails";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import "./DashboardSection.css";

import React, { useState, useEffect, type JSX } from "react";
import SportsFootballIcon from "@mui/icons-material/SportsFootball";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import SportsBaseballIcon from "@mui/icons-material/SportsBaseball";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const theme = createTheme({
  breakpoints: {
    values: { xs: 0, sm: 432, md: 657, lg: 900, xl: 1200 }
  }
});

//Get the height of the navbar and app bar
const useNavbarHeight = () => {
  const [navbarHeight, setNavbarHeight] = useState(70);
  const [appBarHeight, setAppBarHeight] = useState(60);

  useEffect(() => {
    const updateHeights = () => {
      const navbar = document.querySelector('.navbar');
      const appBar = document.querySelector('.MuiAppBar-root');
      
      if (navbar) {
        setNavbarHeight(navbar.getBoundingClientRect().height);
      }
      if (appBar) {
        setAppBarHeight(appBar.getBoundingClientRect().height);
      }
    };

    updateHeights();

    // Update on window resize
    window.addEventListener('resize', updateHeights);
    
    // Also update after a short delay to account for dynamic content loading
    const timeoutId = setTimeout(updateHeights, 100);
    
    // Additional timeout for AppBar rendering
    const appBarTimeoutId = setTimeout(updateHeights, 500);

    return () => {
      window.removeEventListener('resize', updateHeights);
      clearTimeout(timeoutId);
      clearTimeout(appBarTimeoutId);
    };
  }, []);

  //return the height of the navbar and app bar
  return { navbarHeight, appBarHeight };
};

const Dashboard = () => {
  const { user, isLoading: isLoadingAuth0 } = useAuth0();
  const { teamsBySport, loading: loadingFavTeams, error: errorFavTeams } = useFetchFavTeams(user?.email);
  const [selectedTab, setSelectedTab] = useState(0);
  const { navbarHeight, appBarHeight } = useNavbarHeight();

  const { NBAFavorites = [], NFLFavorites = [], MLBFavorites = [] } = teamsBySport;

  const sports = [
    { label: "NBA", icon: <SportsBasketballIcon />, favorites: NBAFavorites },
    { label: "NFL", icon: <SportsFootballIcon />, favorites: NFLFavorites },
    { label: "MLB", icon: <SportsBaseballIcon />, favorites: MLBFavorites },
  ];

  const currentSport = ['basketball', 'football', 'baseball'][selectedTab];
  const currentLeague = ['nba', 'nfl', 'mlb'][selectedTab];
  const currentFavs = [NBAFavorites, NFLFavorites, MLBFavorites][selectedTab];

  const { data: teams, loading: teamsLoading, error: teamsError } = useFetchTeamDetails(
    currentSport as 'basketball' | 'football' | 'baseball',
    currentLeague as 'nba' | 'nfl' | 'mlb',
    currentFavs
  ); 

  const {data: scoreboardEvents} = useScoreboardData(
    currentSport as 'basketball' | 'football' | 'baseball',
    currentLeague as 'nba' | 'nfl' | 'mlb'
  );

  const [teamOrder, setTeamOrder] = useState<string[]>([]);

  // Sync teamOrder when teams change
  useEffect(() => {
    if (teams.length && teamOrder.length === 0) {
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

  if (isLoadingAuth0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }
  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <p>Please login to view your favorite teams</p>
      </Box>
    );
  }

  if (loadingFavTeams) {
    return <p>Loading...</p>;
  }

  if (errorFavTeams) {
    return <p>Error: {errorFavTeams}</p>;
  }

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    setTeamOrder([]);
  }

  const getGameInfo = (team: any): JSX.Element => {
    const event = team.team?.nextEvent?.[0]?.competitions?.[0];
    const state = event?.status?.type?.state;
    let liveEvent = null;
    
    if (state == 'in') {            //have to fetch live event data separately
      liveEvent = scoreboardEvents?.find((e: any) => e.id === event.id);  
    }
    else {
      liveEvent = null;
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

  const renderTabContent = () => {
    if (teamsLoading) return <p>Loading {currentLeague.toUpperCase()} teams...</p>;
    console.log(teamsError);
    if (teamsError) return <p>Error: {teamsError}</p>;
    if (!teams.length) return <p>No favorite teams for {currentLeague.toUpperCase()}, select some on the "Select Teams" page</p>;

    return (
      <section className="dashboard-section">
        {teamOrder.map((id) => {
          const team = teams.find((t: any) => t.team.id === id);
          if (!team) return null;

          return (
            <article
              key={team.team.id}
              draggable
              onDragStart={(e) => onDragStart(e, team.team.id)}
              onDrop={(e) => onDrop(e, team.team.id)}
              onDragOver={onDragOver}
              style={{ backgroundColor: "transparent", padding: 16, border: "1px solid #ccc", borderRadius: 8, cursor: "move" }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <img
                    src={team.team.logos?.[0]?.href}
                    alt={`Logo of ${team.team.displayName}`}
                    style={{ width: "50px", height: "50px", objectFit: "contain" }}
                  />
                  <Box>
                    <Typography variant="h6">{team.team.displayName}</Typography>
                    <Typography variant="body2">
                      Record: {team.team.record?.items?.[0]?.summary || "N/A"}, {team.team.standingSummary || ""}

                    </Typography>
                    <Typography variant="body2">
                      {getGameInfo(team)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </article>
          );
        })}
      </section>
    );
  };


  return (
    <ThemeProvider theme={theme}>
      <Box height="100%" width="100%" display="flex" flexDirection="column" overflow="hidden">
        <AppBar position="fixed" color="primary" sx={{ 
          top: `${navbarHeight}px`,
          left: 0,
          right: 0,
          zIndex: 1000
        }}>
          <Tabs value={selectedTab} onChange={handleTabChange} variant="fullWidth" centered>
            {sports.map((sport) => (
              <Tab
                key={sport.label}
                icon={sport.icon}
                label={sport.label}
                sx={{
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: 'primary.light',
                  },
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'text.primary',
                  },
                  transition: 'all 0.3s ease',
                  '& .MuiTab-iconWrapper': {
                    color: 'text.primary',
                  },
                }}
              />
            ))}
          </Tabs>
        </AppBar>

        <Box
          flex={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            paddingLeft: 0,
            paddingRight: 0,
            paddingBottom: 2,
            paddingTop: `${navbarHeight + appBarHeight + 10}px`,
            overflow: "hidden",
          }}
        >
          {renderTabContent()}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard; 