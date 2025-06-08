import React from 'react';
import { Box, Typography, CardContent } from '@mui/material';

interface TeamCardProps {
  team: any;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDrop: (e: React.DragEvent, dropId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onClick: () => void;
  getGameInfo: (team: any) => React.ReactNode;
}

export const TeamCard: React.FC<TeamCardProps> = ({
  team,
  onDragStart,
  onDrop,
  onDragOver,
  onClick,
  getGameInfo
}) => {
  return (
    <article
      key={team.team.id}
      draggable
      onDragStart={(e) => onDragStart(e, team.team.id)}
      onDrop={(e) => onDrop(e, team.team.id)}
      onDragOver={onDragOver}
      style={{ 
        backgroundColor: "transparent", 
        padding: 16, 
        border: "1px solid #ccc", 
        borderRadius: 8, 
        cursor: "pointer" 
      }}
      onClick={onClick}
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
};