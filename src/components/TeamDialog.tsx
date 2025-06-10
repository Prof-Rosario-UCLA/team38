import React from 'react';
import {
  Dialog,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Grid,
  Card,
  CardContent,
  Chip
} from '@mui/material';



interface TeamDialogProps {
  open: boolean;
  onClose: () => void;
  team: any;
}

export const TeamDialog: React.FC<TeamDialogProps> = ({ 
  open, 
  onClose, 
  team, 
}) => {
  if (!team) return null;

  // Helper function to find stat value by name
  const getStatValue = (stats: any[], statName: string) => {
    const stat = stats?.find(s => s.name === statName);
    return stat ? stat.value : null;
  };

  // Helper function to format percentage
  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  // Helper function to format average
  const formatAverage = (value: number) => {
    return value.toFixed(2);
  };


  // Get record items
  const recordItems = team.team.record?.items || [];
  const overallRecord = recordItems.find((item: { type: string; }) => item.type === 'total');
  const homeRecord = recordItems.find((item: { type: string; }) => item.type === 'home');
  const awayRecord = recordItems.find((item: { type: string; }) => item.type === 'road');

  // Check if this is NBA (has pointsFor/Against in thousands) or MLB (has smaller point values)
  const overallStats = overallRecord?.stats || [];
  const pointsFor = getStatValue(overallStats, 'pointsFor');
  const isNBA = pointsFor && pointsFor > 1000;

  const renderRecordCard = (record: any, title: string) => {
    if (!record) return null;
    
    const stats = record.stats || [];
    const winPercent = getStatValue(stats, 'winPercent');
    
    return (
      <Card sx={{ minWidth: 200}}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h5" color="primary">
            {record.summary}
          </Typography>
          {winPercent && (
            <Typography variant="body2" color="text.secondary">
              {formatPercent(winPercent)}
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderOverallStats = () => {
    if (!overallRecord) return null;
    
    const stats = overallRecord.stats || [];
    const streak = getStatValue(stats, 'streak');
    const gamesBehind = getStatValue(stats, 'divisionGamesBehind') || getStatValue(stats, 'gamesBehind');

    const playoffSeed = getStatValue(stats, 'playoffSeed');
    
    return (
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {streak !== null && (
            <Grid >
              <Chip 
                label={`Streak: ${streak > 0 ? `W${streak}` : streak < 0 ? `L${Math.abs(streak)}` : 'Even'}`}
                color={streak > 0 ? 'success' : streak < 0 ? 'error' : 'default'}
              />
            </Grid>
          )}
          {gamesBehind !== null && (
            <Grid >
              <Chip label={`Games Behind: ${gamesBehind}`} />
            </Grid>
          )}
          {playoffSeed !== null && playoffSeed > 0 && (
            <Grid >
              <Chip label={`Playoff Seed: ${playoffSeed}`} color="primary" />
            </Grid>
          )}
        </Grid>
      </Box>
    );
  };

  const renderOffensiveStats = () => {
    if (!overallRecord) return null;
    
    const stats = overallRecord.stats || [];
    const pointsFor = getStatValue(stats, 'pointsFor');
    const pointsAgainst = getStatValue(stats, 'pointsAgainst');
    const avgPointsFor = getStatValue(stats, 'avgPointsFor');
    const avgPointsAgainst = getStatValue(stats, 'avgPointsAgainst');
    const pointDifferential = getStatValue(stats, 'pointDifferential');
    
    if (!pointsFor && !avgPointsFor) return null;
    
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          {isNBA ? 'Scoring Stats' : 'Run Stats'}
        </Typography>
        <Grid container spacing={2}>
          <Grid >
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  {isNBA ? 'Points For' : 'Runs For'}
                </Typography>
                <Typography variant="h6">
                  {pointsFor || 'N/A'}
                </Typography>
                {avgPointsFor && (
                  <Typography variant="body2" color="text.secondary">
                    Avg: {formatAverage(avgPointsFor)}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid >
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  {isNBA ? 'Points Against' : 'Runs Against'}
                </Typography>
                <Typography variant="h6">
                  {pointsAgainst || 'N/A'}
                </Typography>
                {avgPointsAgainst && (
                  <Typography variant="body2" color="text.secondary">
                    Avg: {formatAverage(avgPointsAgainst)}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {pointDifferential !== null && (
          <Box sx={{ mt: 1 }}>
            <Chip 
              label={`${isNBA ? 'Point' : 'Run'} Differential: ${pointDifferential > 0 ? '+' : ''}${pointDifferential}`}
              color={pointDifferential > 0 ? 'success' : pointDifferential < 0 ? 'error' : 'default'}
            />
          </Box>
        )}
      </Box>
    );
  };

  const renderPlayoffInfo = () => {
    if (!overallRecord) return null;
    
    const stats = overallRecord.stats || [];
    const playoffPercent = getStatValue(stats, 'playoffPercent');
    const wildCardPercent = getStatValue(stats, 'wildCardPercent');
    
    const hasPlayoffInfo = playoffPercent || wildCardPercent ;
    if (!hasPlayoffInfo) return null;
    
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Playoff Picture
        </Typography>
        <Grid container spacing={1}>
          {playoffPercent && (
            <Grid>
              <Chip label={`Playoff Odds: ${formatPercent(playoffPercent / 100)}`} />
            </Grid>
          )}
          {wildCardPercent && (
            <Grid>
              <Chip label={`Wild Card Odds: ${formatPercent(wildCardPercent / 100)}`} />
            </Grid>
          )}
        </Grid>
      </Box>
    );
  };

  return (
    <Dialog onClose={onClose} open={open} maxWidth="md" fullWidth slotProps={{
      paper: {
        sx: {
          bgcolor: 'Canvas',
          color: 'CanvasText',
          // Apply to all nested components
          '& .MuiTypography-root': {
            color: 'CanvasText',
          },
          '& .MuiBox-root': {
            color: 'CanvasText',
          },
          '& .MuiButton-root': {
            color: 'CanvasText',
          },
          '& .MuiDivider-root': {
            borderColor: 'currentColor',
            opacity: 0.12,
          },
          '& .MuiCard-root': {
            backgroundColor: 'Canvas',
            color: 'CanvasText',
            borderColor: 'CanvasText',
          },
          '& .MuiChip-root': {
            color: 'CanvasText',
            borderColor: 'CanvasText',
          },

        }
      }
    }}>
      <Box sx={{ p: 1, bgcolor: "inherit"}}>
        {/* Team Header */}
        <Box display="flex" flexDirection="column" alignItems="center" gap={2} sx={{ mb: 1 }}>
          <img
            src={team.team.logos?.[0]?.href}
            alt={`Logo of ${team.team.displayName}`}
            style={{ width: "80px", height: "80px", objectFit: "contain" }}
          />
          <Typography variant="h5">{team.team.displayName}</Typography>
          {team.team.standingSummary && (
            <Typography variant="body1" color="text.secondary">
              {team.team.standingSummary}
            </Typography>
          )}
        </Box>

        <Divider sx={{ mb: 1 }} />
        {team.team.record?.items && (
          <>
            <Typography variant="h6" gutterBottom>
              Record Breakdown
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2,  }}>
              <Box sx={{ flex: 1 }}>
                {renderRecordCard(overallRecord, 'Overall')}
              </Box>
              <Box sx={{ flex: 1 }}>
                {renderRecordCard(homeRecord, 'Home')}
              </Box>
              <Box sx={{ flex: 1 }}>
                {renderRecordCard(awayRecord, 'Away')}
              </Box>
            </Box>
          </>
        )}

        {/* Overall Stats */}
  
        {renderOverallStats()}
        {renderOffensiveStats()}
        {renderPlayoffInfo()}

        {/* Venue */}
        {team.team.franchise.venue && (
          <Box sx={{ display:'flex', mt: 3 }}>
            <img
              src={team.team.franchise.venue.images?.[0]?.href }
              alt={`Venue of ${team.team.displayName}`}
              style={{ width: "400px", height: "225px", objectFit: "contain", marginRight: '16px', flex: 1 }}
            />
            <Box sx={{flex: 1}}>
              Home Venue: {team.team.franchise.venue.fullName}  <br />
              Location: {team.team.franchise.venue.address.city}, {team.team.franchise.venue.address.state}
            </Box>
          </Box>
        )}



        
      </Box>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};