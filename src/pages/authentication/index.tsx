import React, { ReactNode } from "react";
// import { useLocation } from "react-router-dom";

const Authentication: React.FC<{ children: ReactNode }> = ({ children }) => {
  // const location = useLocation();
  
  // const url: string = `/login?return=${location.pathname}${location.search}`;

  // if (!isUserAuthenticated)
    // if (location.pathname !== "/login") return <Navigate to={url} />;

  return children;
};

export default Authentication;
