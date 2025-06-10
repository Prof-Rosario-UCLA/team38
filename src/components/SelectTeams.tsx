import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import useFetchTeams from '../customHooks/useFetchTeams';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Pagination from '@mui/material/Pagination';
import { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import CircularProgress from '@mui/material/CircularProgress';
import { Button, Snackbar } from '@mui/material';
import Grid from '@mui/material/Grid';
import useFetchFavTeams from '../customHooks/useFetchFavTeams';
import Alert from '@mui/material/Alert';
import useWindowDimensions  from '../customHooks/useWindowDimensions';

interface Team {
  id: string;
  abbreviation: string;
  displayName: string;
  logos: { href: string }[];
}

const isLocal = true;

type League = 'NBA' | 'NFL' | 'MLB';
interface FaviteTeamsPayload {
  UserID: string;
  NBAFavorites?: string[];
  NFLFavorites?: string[];
  MLBFavorites?: string[];
}

const useNavbarHeight = () => {
  const [navbarHeight, setNavbarHeight] = useState(70);

  useEffect(() => {
    const updateNavbarHeight = () => {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        setNavbarHeight(navbar.getBoundingClientRect().height);
      }
    };

    // Initial measurement
    updateNavbarHeight();

    // Update on window resize
    window.addEventListener('resize', updateNavbarHeight);
    
    // Also update after a short delay to account for dynamic content loading
    const timeoutId = setTimeout(updateNavbarHeight, 100);

    return () => {
      window.removeEventListener('resize', updateNavbarHeight);
      clearTimeout(timeoutId);
    };
  }, []);

  return navbarHeight;
};

const SelectTeams = () => {
  const { user, isLoading } = useAuth0();
  const userEmail: string = user?.email || '';
  const navbarHeight = useNavbarHeight();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <p>Please login to select your favorite teams.</p>
      </Box>
    );
  }

  const [league, setLeague] = useState<League>('NBA');
  const { teams, loading, error } = useFetchTeams(league);
    const [selectedTeams, setSelectedTeams] = useState<Record<League, string[]>>({
    NBA: [],
    NFL: [],
    MLB: []
  });

  const { width, height} = useWindowDimensions();
  const getGridColumns = () => {
    if (width < 350) return 0.75;
    if (width < 550) return 1;
    if (width < 700) return 2;
    if (width < 900) return 3;
    if (width < 1100) return 4;
    if (width < 1300) return 5;
    return 6;
  };
  const getGridRows = () => {
    if (height < 450) return 1;
    if (height < 550) return 2;
    if (height < 630) return 3;
    if (height < 700) return 4;
    if (height < 800) return 5;
    if (height < 950) return 6;

    return 7;
  }
  const gridColumns = getGridColumns();
  const gridRows = getGridRows();
  const itemsPerPage = gridColumns * gridRows;


  const [page, setPage] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);

  const { teamsBySport } = useFetchFavTeams(userEmail);

  const handleChange = (event: any) => {
    setLeague(event.target.value);
  };

  useEffect(() => {
  if (teamsBySport && userEmail) {
    setSelectedTeams({
      NBA: teamsBySport.NBAFavorites || [],
      NFL: teamsBySport.NFLFavorites || [],
      MLB: teamsBySport.MLBFavorites || [],
    });
  }
}, [teamsBySport, userEmail]);

  useEffect(() => {
    setPage(1);
  }, [league, teams]);

  const handleTeamToggle = (teamId: string) => {
    setSelectedTeams((prevSelected) => {
      const currentLeagueTeams = prevSelected[league];
      const isSelected = currentLeagueTeams.includes(teamId);
      const updatedTeams = isSelected
        ? currentLeagueTeams.filter((id) => id !== teamId)
        : [...currentLeagueTeams, teamId];

      return {
        ...prevSelected,
        [league]: updatedTeams
      };
    });
  }

  const saveFavoriteTeams = async () => {
    setIsSaving(true);
    try {
      const payload: FaviteTeamsPayload = {
        UserID: userEmail,
        NBAFavorites: selectedTeams.NBA,
        NFLFavorites: selectedTeams.NFL,
        MLBFavorites: selectedTeams.MLB
      };

      const response = await fetch( isLocal ? 'http://localhost:8080/favorite-teams' : 'https://cs144-25s-dhruvpareek12.uw.r.appspot.com/favorite-teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      console.log('Response status:', response.status);
      const responseBody = await response.text();
      console.log("Response body:", responseBody);

      if (response.ok) {
        setSaveStatus('success');
      } else {
        setSaveStatus('error');
         throw new Error('Failed to save favorite teams');
      }

  
      

    } catch (error) {
      console.error('Error saving favorite teams:', error);
    } finally {
      setIsSaving(false);
    }
  };

  
  const start = (page - 1) * itemsPerPage;
  const pagedTeams = teams.slice(start, start + itemsPerPage);

  return (
    <div className="select-teams-container">
    <header className="header-content" style={{ paddingTop: `${navbarHeight + 10}px` }}>
      <p>Choose your favorite teams to follow.</p>
      <Box sx={{ minWidth: 120, maxWidth: 220, mb: 2 }}>
        <FormControl fullWidth>
          <InputLabel sx={{ color: 'primary.main' }}>League</InputLabel>
          <Select
            value={league}
            label="League"
            onChange={handleChange}
            sx={{
              color: 'primary.main',
              '.MuiSelect-icon': {
                color: 'primary.main',
              },
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: 'grey.900',
                  color: 'white',
                },
              },
            }}
          >
            <MenuItem value="NBA">NBA</MenuItem>
            <MenuItem value="NFL">NFL</MenuItem>
            <MenuItem value="MLB">MLB</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </header>
    <main>
      {loading ? (
        <Box display ="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : error ? (
        <div>Error loading teams</div>
      ) : (
        <>
        <Grid container spacing={2}  >
          {pagedTeams.map((team: Team) => ( 
            <Grid key={team.id}>
              <Box border={1} borderColor="grey.300" borderRadius={2} p={1} 
                sx={{ backgroundColor: selectedTeams[league].includes(team.abbreviation) ? 'primary.light' : 'transparent',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                }}
              >
                <ListItem disablePadding>
                  <ListItemButton
                    role={undefined}
                    onClick={() => handleTeamToggle(team.abbreviation)}
                    dense
                  >
                    <ListItemIcon sx={{ display: 'flex', alignItems: 'center' }}>
                      <img
                        src={team.logos[0].href}
                        alt={team.displayName}
                        style={{ width: 30, height: 30, marginRight: 8 }}
                      />
                    </ListItemIcon>

                    <ListItemText id={`team-${team.id}`} primary={team.displayName} />
                  </ListItemButton>
                </ListItem>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, color:"primary"}}>
          <Pagination
            count={Math.ceil(teams.length / itemsPerPage)}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            
            sx={{
              '& .MuiPaginationItem-root': {
                color: 'primary.main',
                borderColor: 'primary.main',
              },
              '& .Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            onClick={saveFavoriteTeams}
            disabled={isSaving}
            size ="large"
            >
              {isSaving ? <CircularProgress size={24} /> : 'Save Favorite Teams'}
            </Button>
        </Box>
        </>
      )}
      <Snackbar
        open={saveStatus !== null}
        autoHideDuration={6000}
        onClose={() => setSaveStatus(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} 
      >
        <Alert
          severity={saveStatus === 'success' ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {saveStatus === 'success'
            ? 'Teams saved successfully!'
            : 'Failed to save teams. Please try again.'}
        </Alert>
      </Snackbar>
    </main>
    </div>
  );
};

export default SelectTeams; 