import React, { useState, useEffect } from 'react';
import {
 Snackbar,
 Alert,
 Button,
 Box
} from '@mui/material';
import { InstallMobile, InstallDesktop } from '@mui/icons-material';


interface BeforeInstallPromptEvent extends Event {
 prompt(): Promise<void>;
 userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}


export const InstallPrompt: React.FC = () => {
 const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
 const [showInstallPrompt, setShowInstallPrompt] = useState(false);
 const [isInstalled, setIsInstalled] = useState(false);


 useEffect(() => {
   const handleBeforeInstallPrompt = (e: Event) => {
     e.preventDefault();
     setDeferredPrompt(e as BeforeInstallPromptEvent);
     setShowInstallPrompt(true);
   };


   const handleAppInstalled = () => {
     setIsInstalled(true);
     setShowInstallPrompt(false);
     setDeferredPrompt(null);
   };


   // Check if already installed
   if (window.matchMedia('(display-mode: standalone)').matches) {
     setIsInstalled(true);
   }


   window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
   window.addEventListener('appinstalled', handleAppInstalled);


   return () => {
     window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
     window.removeEventListener('appinstalled', handleAppInstalled);
   };
 }, []);


 const handleInstall = async () => {
   if (!deferredPrompt) return;


   deferredPrompt.prompt();
   const { outcome } = await deferredPrompt.userChoice;
  
   if (outcome === 'accepted') {
     console.log('User accepted the install prompt');
   }
  
   setDeferredPrompt(null);
   setShowInstallPrompt(false);
 };


 const handleDismiss = () => {
   setShowInstallPrompt(false);
   // Don't show again for this session
   setDeferredPrompt(null);
 };


 if (isInstalled || !showInstallPrompt) {
   return null;
 }


 return (
   <Snackbar
     open={showInstallPrompt}
     anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
     sx={{ bottom: { xs: 90, sm: 24 } }}
   >
     <Alert
       severity="info"
       action={
         <Box display="flex" gap={1}>
           <Button
             color="inherit"
             size="small"
             onClick={handleInstall}
             startIcon={<InstallMobile />}
           >
             Install
           </Button>
           <Button
             color="inherit"
             size="small"
             onClick={handleDismiss}
           >
             Later
           </Button>
         </Box>
       }
     >
       Install Sports Dashboard for a better experience!
     </Alert>
   </Snackbar>
 );
};
