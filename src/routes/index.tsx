import React from "react";
import { useRoutes } from "react-router-dom";
import { Routes } from "./routes";

const RoutesList = () => {
  const elements = useRoutes(Routes);
  return (
    <React.Fragment>
         { elements }
    </React.Fragment>
  );
};

export default RoutesList;
