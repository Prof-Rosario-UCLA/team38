import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Chip
} from '@mui/material';

interface TeamDialogProps {
  open: boolean;
  onClose: () => void;
  team: any;
  getGameInfo: (team: any) => React.ReactNode;
}

export const TeamDialog: React.FC<TeamDialogProps> = ({ 
  open, 
  onClose, 
  team, 
  getGameInfo 
}) => {
  if (!team) return null;

  return (
    <Dialog onClose={onClose} open={open}>
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
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
