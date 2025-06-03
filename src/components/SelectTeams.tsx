import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import useFetchTeams from './customHooks/useFetchTeams';
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
import useFetchFavTeams from './customHooks/useFetchFavTeams';
import Alert from '@mui/material/Alert';
import useWindowDimensions  from './customHooks/useWindowDimensions';

interface Team {
  id: string;
  abbreviation: string;
  displayName: string;
  logos: { href: string }[];
}

type League = 'NBA' | 'NFL' | 'MLB';
interface FaviteTeamsPayload {
  UserID: string;
  NBAFavorites?: string[];
  NFLFavorites?: string[];
  MLBFavorites?: string[];
}

const SelectTeams = () => {
  const { user } = useAuth0();
  const userEmail: string = user?.email || '';

  if (!user) {
    return <p>Please log in to select your favorite teams.</p>;
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
    if (width < 500) return 1;
    if (width < 700) return 2;
    if (width < 1000) return 3;
    if (width < 1300) return 4;
    return 5;
  };
  const getGridRows = () => {
    if (height < 600) return 1;
    if (height < 700) return 2;
    if (height < 800) return 3;
    if (height < 900) return 4;
    if (height < 1000) return 5;
    if (height < 1100) return 6;
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

      const response = await fetch('http://localhost:3000/favorite-teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

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
    <>
    <header>
      <h1>Select Teams</h1>
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
    </>
  );
};

export default SelectTeams; 