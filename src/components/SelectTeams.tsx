import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import useFetchTeams from './customHooks/useFetchTeams';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Pagination from '@mui/material/Pagination';
import { useEffect, useState } from 'react';
import useItemsPerPage from './customHooks/useItemsPerPage';

interface Team {
  id: string;
  name: string;
}

const SelectTeams = () => {
  const [league, setLeague] = useState('NBA');
  const { teams, loading, error } = useFetchTeams(league);
  const [selectedTeams, setSelectedTeams] = React.useState<string[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = useItemsPerPage() || 4;

  const handleChange = (event: any) => {
    setLeague(event.target.value);
  };

  useEffect(() => {
      setPage(1);
    }, [league, teams]);  

  const handleTeamToggle = (teamId: string) => {
    setSelectedTeams((prev) => {
      if (prev.includes(teamId)) {
        return prev.filter((id) => id !== teamId);
      } else {
        return [...prev, teamId];
      }
    });
  };

  const start = (page - 1) * itemsPerPage;
  const pagedTeams = teams.slice(start, start + itemsPerPage);

  return (
    <div>
      <h1>Select Teams</h1>
      <p>Choose your favorite teams to follow.</p>
      <Box sx={{ minWidth: 120, maxWidth: 180, mb: 2 }}>
        <FormControl fullWidth>
          <InputLabel>League</InputLabel>
          <Select
            value={league}
            label="League"
            onChange={handleChange}
          >
            <MenuItem value="NBA">NBA</MenuItem>
            <MenuItem value="NFL">NFL</MenuItem>
            <MenuItem value="MLB">MLB</MenuItem>
          </Select>
        </FormControl>
      </Box>
    
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error loading teams</div>
      ) : (
        <>
        <List>
          {pagedTeams.map((team: Team) => (
            <ListItem
              key={team.id}
              disablePadding
            >
              <ListItemButton
                role={undefined}
                onClick={() => handleTeamToggle(team.id)}
                dense
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selectedTeams.includes(team.id)}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText id={`team-${team.id}`} primary={team.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={Math.ceil(teams.length / itemsPerPage)}
          page={page}
          onChange={(_, value) => setPage(value)}
        />
        </Box>
        </>
      )}
    </div>
  );
};

export default SelectTeams; 