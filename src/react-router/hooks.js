import React from "react";
import Context from "./RouterContext.js";
import matchPath from "./matchPath.js";

// import { __RouterContext as RouterContext } from "react-router";


const useContext = React.useContext;

export function useHistory() {
  return useContext(Context).history;
}

export function useLocation() {
  return useContext(Context).location;
}

export function useParams() {
  const match = useContext(Context).match;
  return match ? match.params : {};
}

export function useRouteMatch(path) {
  return path
    ? matchPath(useLocation().pathname, path)
    : useContext(Context).match;
}
