import React from 'react';
import {
 Box,
 CircularProgress,
 Alert,
 AlertTitle
} from '@mui/material';
import { CloudOff, Refresh } from '@mui/icons-material';


interface OfflineMessageProps {
 message?: string;
 showSpinner?: boolean;
 variant?: 'loading' | 'error' | 'info';
}


export const OfflineMessage: React.FC<OfflineMessageProps> = ({
 message = "Attempting to fetch data...",
 showSpinner = true,
 variant = 'loading'
}) => {
 const getIcon = () => {
   switch (variant) {
     case 'error':
       return <CloudOff sx={{ fontSize: 48, color: 'error.main' }} />;
     case 'loading':
       return showSpinner ? <CircularProgress size={48} /> : <Refresh sx={{ fontSize: 48 }} />;
     default:
       return <Refresh sx={{ fontSize: 48 }} />;
   }
 };


 const getSeverity = () => {
   switch (variant) {
     case 'error':
       return 'error';
     case 'loading':
       return 'info';
     default:
       return 'info';
   }
 };


 return (
   <Box
     display="flex"
     flexDirection="column"
     alignItems="center"
     justifyContent="center"
     minHeight="200px"
     gap={2}
     p={3}
   >
     {getIcon()}
     <Alert severity={getSeverity()} sx={{ maxWidth: 400 }}>
       <AlertTitle>
         {variant === 'error' ? 'Connection Error' : 'Loading Data'}
       </AlertTitle>
       {message}
     </Alert>
   </Box>
 );
};
