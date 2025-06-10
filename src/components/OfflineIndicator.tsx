
import React, { useState, useEffect } from 'react';
import {
 Alert,
 Box,
 Typography,
 Snackbar
} from '@mui/material';
import { Wifi, WifiOff } from '@mui/icons-material';
// Ensure the path is correct or create the module if it doesn't exist
import { useOfflineStatus } from '../customHooks/useOfflineStatus'; 


export const OfflineIndicator: React.FC = () => {
 const { isOnline, isOffline, wasOffline } = useOfflineStatus();

 const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowSnackbar(true);
    }
  }, [isOnline, wasOffline]);


 if (isOnline && !wasOffline) {
   return null;
 }


 return (
   <>
     {isOffline && (
       <Box
         sx={{
           position: 'fixed',
           top: 0,
           left: 0,
           right: 0,
           zIndex: 9999,
           bgcolor: 'warning.main',
           color: 'warning.contrastText',
           p: 1,
           textAlign: 'center'
         }}
       >
         <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
           <WifiOff fontSize="small" />
           <Typography variant="body2">
             You're offline. Some features may be limited.
           </Typography>
         </Box>
       </Box>
     )}
    
     <Snackbar
       open={showSnackbar}
       autoHideDuration={4000}
       anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
       onClose={() => setShowSnackbar(false)}
     >
       <Alert severity="success" icon={<Wifi />} onClose={() => setShowSnackbar(false)}>
         Connection restored! Refreshing data...
       </Alert>
     </Snackbar>
   </>
 );
};
