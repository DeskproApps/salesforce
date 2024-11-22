import { useMemo } from "react";
import { useLocation } from "react-router-dom";

/**
 * Get the base path from the current location pathname
 */
const useBasePath = () => {
  const { pathname } = useLocation();

  return useMemo(() => {
    return `/${pathname.split("/").filter((f) => f)[0]}`;
  }, [pathname]);
};

export { useBasePath };
