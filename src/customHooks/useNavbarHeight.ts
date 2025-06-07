import { useState, useEffect } from "react";

export const useNavbarHeight = () => {
  const [navbarHeight, setNavbarHeight] = useState(70);
  const [appBarHeight, setAppBarHeight] = useState(60);
  const [subTabHeight, setSubTabHeight] = useState(48);

  useEffect(() => {
    const updateHeights = () => {
      const navbar = document.querySelector(".navbar");
      const appBar = document.querySelector(".MuiAppBar-root");
      const subTabs = document.querySelector(".sub-tabs");

      if (navbar) {
        setNavbarHeight(navbar.getBoundingClientRect().height);
      }
      if (appBar) {
        setAppBarHeight(appBar.getBoundingClientRect().height);
      }
      if (subTabs) {
        setSubTabHeight(subTabs.getBoundingClientRect().height);
      }
    };

    updateHeights();

    // Update on window resize
    window.addEventListener("resize", updateHeights);

    // Also update after a short delay to account for dynamic content loading
    const timeoutId = setTimeout(updateHeights, 100);

    // Additional timeout for AppBar rendering
    const appBarTimeoutId = setTimeout(updateHeights, 500);

    return () => {
      window.removeEventListener("resize", updateHeights);
      clearTimeout(timeoutId);
      clearTimeout(appBarTimeoutId);
    };
  }, []);

  //return the height of the navbar and app bar
  return { navbarHeight, appBarHeight, subTabHeight };
};
