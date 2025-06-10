import { useState, useEffect } from "react";

export interface ServiceWorkerHook {
  isInstalled: boolean;
  isWaitingToInstall: boolean;
  updateAvailable: boolean;
  installUpdate: () => void;
}

export const useServiceWorker = (): ServiceWorkerHook => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isWaitingToInstall, setIsWaitingToInstall] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
    null
  );

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered: ", registration);
          setIsInstalled(true);

          // Check for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed") {
                  if (navigator.serviceWorker.controller) {
                    // Update available
                    setUpdateAvailable(true);
                    setWaitingWorker(newWorker);
                  }
                }
              });
            }
          });
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError);
        });
    }
  }, []);

  const installUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
      setUpdateAvailable(false);
      window.location.reload();
    }
  };

  return {
    isInstalled,
    isWaitingToInstall,
    updateAvailable,
    installUpdate,
  };
};
