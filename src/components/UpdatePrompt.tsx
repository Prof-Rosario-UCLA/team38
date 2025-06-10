import React from 'react';
import {
 Snackbar,
 Alert,
 Button,
} from '@mui/material';
import { SystemUpdate } from '@mui/icons-material';
import { useServiceWorker } from '../customHooks/useServiceWorker';


export const UpdatePrompt: React.FC = () => {
 const { updateAvailable, installUpdate } = useServiceWorker();


 if (!updateAvailable) {
   return null;
 }


 return (
   <Snackbar
     open={updateAvailable}
     anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
   >
     <Alert
       severity="info"
       action={
         <Button
           color="inherit"
           size="small"
           onClick={installUpdate}
           startIcon={<SystemUpdate />}
         >
           Update
         </Button>
       }
     >
       A new version is available!
     </Alert>
   </Snackbar>
 );
};
