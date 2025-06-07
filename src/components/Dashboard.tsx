import { useAuth0 } from "@auth0/auth0-react";
import useFetchFavTeams from "./customHooks/useFetchFavTeams";
import useScoreboardData from "./customHooks/useScoreboardData";
import useFetchTeamDetails from "./customHooks/useFetchTeamDetails";
// Ensure the module exists or create it if it doesn't
import useFetchNews, { type NewsArticle } from "./customHooks/useFetchNews";
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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Link from "@mui/material/Link";

const theme = createTheme({
  breakpoints: {
    values: { xs: 0, sm: 432, md: 657, lg: 900, xl: 1200 }
  }
});

//Get the height of the navbar and app bar
const useNavbarHeight = () => {
  const [navbarHeight, setNavbarHeight] = useState(70);
  const [appBarHeight, setAppBarHeight] = useState(60);
  const [subTabHeight, setSubTabHeight] = useState(48);

  useEffect(() => {
    const updateHeights = () => {
      const navbar = document.querySelector('.navbar');
      const appBar = document.querySelector('.MuiAppBar-root');
      const subTabs = document.querySelector('.sub-tabs');


      
      if (navbar) {
        setNavbarHeight(navbar.getBoundingClientRect().height);
      }
      if (appBar) {
        setAppBarHeight(appBar.getBoundingClientRect().height);
      }
      if (subTabs) {
        setSubTabHeight(subTabs.getBoundingClientRect().height);
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
  return { navbarHeight, appBarHeight, subTabHeight };
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

const Dashboard = () => {
  const { user, isLoading: isLoadingAuth0 } = useAuth0();
  const { teamsBySport, loading: loadingFavTeams, error: errorFavTeams } = useFetchFavTeams(user?.email);
  const [selectedTab, setSelectedTab] = useState(0);
  const [subTabValue, setSubTabValue] = useState(0);
  const { navbarHeight, appBarHeight, subTabHeight } = useNavbarHeight();

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

  const {news, loading: newsLoading, error: newsError} = useFetchNews(
    currentSport as 'basketball' | 'football' | 'baseball',
    currentLeague as 'nba' | 'nfl' | 'mlb'
  );

  const [teamOrder, setTeamOrder] = useState<string[]>([]);

  const [selectedTeam, setSelectedTeam] = useState(null);
  const [open, setOpen] = useState(false);

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

  const handleSubTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSubTabValue(newValue);
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

  interface SimpleDialogProps {
    open: boolean;
    onClose: () => void;
    team: any;
  }

  function SimpleDialog(props: SimpleDialogProps) {
    const { open, onClose, team } = props;

    const handleClose = () => {
      onClose();
      setSelectedTeam(null);
    };

    if (!team) return null;

    return (
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>{team.team.displayName} Details</DialogTitle>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <img
              src={team.team.logos?.[0]?.href}
              alt={`Logo of ${team.team.displayName}`}
              style={{ width: "100px", height: "100px", objectFit: "contain" }}
            />
            <Typography variant="h6">{team.team.displayName}</Typography>
            <Typography variant="body2">
              Record: {team.team.record?.items?.[0]?.summary || "N/A"}, {team.team.standingSummary || ""}
            </Typography>
            <Divider style={{ width: '100%' }} />
            <Typography variant="body1">
              {getGameInfo(team)}
            </Typography>
            {team.team.venue && (
              <Chip label={`Venue: ${team.team.venue.fullName}`} />
            )}
          </Box>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }


  const renderTeamsContent = () => {
    if (teamsLoading) return <p>Loading {currentLeague.toUpperCase()} teams...</p>;
    console.log(teamsError);
    if (teamsError) return <p>Error: {teamsError}</p>;
    if (!teams.length) return <p>No favorite teams for {currentLeague.toUpperCase()}, select some on the "Select Teams" page</p>;

    const handleClose = () => {
      setOpen(false);
      setSelectedTeam(null);
    }



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
              style={{ backgroundColor: "transparent", padding: 16, border: "1px solid #ccc", borderRadius: 8, cursor: "pointer" }}
              onClick={() => {
                setSelectedTeam(team);
                setOpen(true);
              }}
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
        <SimpleDialog
          open={open}
          onClose={handleClose}
          team={selectedTeam}
        />
      </section>
    );
  };

  const renderNewsContent = () => {
    if (newsLoading) return <p>Loading {currentLeague.toUpperCase()} news...</p>;
    if (newsError) return <p>No news available</p>;
    return (
      <section className="dashboard-section">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {news.slice(0, 10).map((article: NewsArticle, index: number) => (
            <Card key={article.id || index} sx={{ display: 'flex', mb: 2 }}>
              {article.images && article.images.length > 0 && (
                <CardMedia
                  component="img"
                  sx={{ width: 180, height: 100, objectFit: 'fill' }}
                  image={article.images[0].url}
                  alt={article.images[0].caption || 'News image'}
                />
              )}
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  <Link
                    href={article.links.web.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.main' } }}
                  >
                    {article.headline}
                  </Link>
                </Typography>
                
                <Box display="flex" gap={2} mb={1}>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(article.published).toLocaleDateString()}
                  </Typography>
                  {article.byline && (
                    <Typography variant="caption" color="text.secondary">
                      By {article.byline}
                    </Typography>
                  )}
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {article.description}
                </Typography>

                {article.categories && article.categories.length > 0 && (
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {article.categories.slice(0, 3).map((category: { description: string }, i: number) => (
                      <Chip
                        key={i}
                        label={category.description}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      </section>
    );
3
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
                icon={sport.icon}
                label={sport.label}
                sx={{
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: 'primary.light',
                  },
                  '&.Mui-selected': {
                    bgcolor: 'white',
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
            <Tab label="News" />
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
              {renderTeamsContent()}
            </Box>
          </TabPanel>
          <TabPanel value={subTabValue} index={1}>
            {renderNewsContent()}
          </TabPanel>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard; 