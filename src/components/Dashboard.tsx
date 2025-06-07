import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import {
  AppBar,
  Tabs,
  Tab,
  Box,
  CircularProgress
} from "@mui/material";


import useFetchFavTeams from "../customHooks/useFetchFavTeams";
import useScoreboardData from "../customHooks/useScoreboardData";
import useFetchTeamDetails from "../customHooks/useFetchTeamDetails";
import useFetchNews from "../customHooks/useFetchNews";
import { useNavbarHeight } from "../customHooks/useNavbarHeight";


import { TabPanel } from "./TabPanel";
import { TeamsSection } from "./TeamsSection";
import { NewsSection } from "./NewsSection";

import { sports, sportMappings } from "./sportsConfig";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";


import "./DashboardSection.css";

const theme = createTheme({
  breakpoints: {
    values: { xs: 0, sm: 432, md: 657, lg: 900, xl: 1200 }
  }
});

const Dashboard = () => {
  const { user, isLoading: isLoadingAuth0 } = useAuth0();
  const { teamsBySport, loading: loadingFavTeams, error: errorFavTeams } = useFetchFavTeams(user?.email);
  const [selectedTab, setSelectedTab] = useState(0);
  const [subTabValue, setSubTabValue] = useState(0);
  const { navbarHeight, appBarHeight, subTabHeight } = useNavbarHeight();

  const { NBAFavorites = [], NFLFavorites = [], MLBFavorites = [] } = teamsBySport;

  const currentSport = sportMappings.sports[selectedTab];
  const currentLeague = sportMappings.leagues[selectedTab];
  const currentFavs = [NBAFavorites, NFLFavorites, MLBFavorites][selectedTab];

  const { data: teams, loading: teamsLoading, error: teamsError } = useFetchTeamDetails(
    currentSport as 'basketball' | 'football' | 'baseball',
    currentLeague as 'nba' | 'nfl' | 'mlb',
    currentFavs
  ); 

  const { data: scoreboardEvents } = useScoreboardData(
    currentSport as 'basketball' | 'football' | 'baseball',
    currentLeague as 'nba' | 'nfl' | 'mlb'
  );

  const { news, loading: newsLoading, error: newsError } = useFetchNews(
    currentSport as 'basketball' | 'football' | 'baseball',
    currentLeague as 'nba' | 'nfl' | 'mlb'
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleSubTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSubTabValue(newValue);
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

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="fixed" sx={{ 
        top: `${navbarHeight}px`,
        left: 0,
        right: 0,
        zIndex: 1000
      }}>
        <Tabs value={selectedTab} onChange={handleTabChange} variant="fullWidth" centered>
          {sports.map((sport) => (
            <Tab
              key={sport.label}
              icon={<sport.icon />}
              label={sport.label}
              sx={{
                color: 'text.primary',
                '&:hover': { bgcolor: 'primary.light' },
                '&.Mui-selected': { bgcolor: 'white', color: 'text.primary' },
                transition: 'all 0.3s ease',
                '& .MuiTab-iconWrapper': { color: 'text.primary' },
              }}
            />
          ))}
        </Tabs>
      </AppBar>
      
      <Box 
        className="sub-tabs"
        sx={{ 
          position: 'fixed',
          top: `${navbarHeight + appBarHeight}px`,
          left: 0,
          right: 0,
          zIndex: 999,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Tabs value={subTabValue} onChange={handleSubTabChange} variant="fullWidth" centered>
          <Tab label="Teams" />
          <Tab label="League News" />
        </Tabs>
      </Box>
      
      <Box flex={1} display="flex" flexDirection="column" overflow="hidden">
        <Box
          sx={{
            height: `calc(100vh - ${navbarHeight + appBarHeight + subTabHeight}px)`,
            marginTop: `${navbarHeight + appBarHeight + subTabHeight}px`,
            overflowY: "auto",
          }}
        >
          <TabPanel value={subTabValue} index={0}>
            <Box sx={{ p: 2 }}>
              <TeamsSection
                teams={teams}
                teamsLoading={teamsLoading}
                teamsError={teamsError}
                currentLeague={currentLeague}
                scoreboardEvents={scoreboardEvents}
              />
            </Box>
          </TabPanel>
          <TabPanel value={subTabValue} index={1}>
            <NewsSection
              news={news}
              newsLoading={newsLoading}
              newsError={newsError}
              currentLeague={currentLeague}
            />
          </TabPanel>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;