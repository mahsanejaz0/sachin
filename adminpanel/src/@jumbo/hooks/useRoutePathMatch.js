import {matchRoutes, useLocation} from "react-router-dom";

export default function useRoutePathMatch(routes) {
    const location =  useLocation();
    const url = location.pathname;
    for (let route of routes) {
        route = route.path;
        const routeSegments = route.split('/');
        const urlSegments = url.split('/');
  
        if (routeSegments.length !== urlSegments.length) {
          continue;
        }
  
        let match = true;
  
        for (let i = 0; i < routeSegments.length; i++) {
          if (routeSegments[i] === urlSegments[i]) {
            continue;
          }
  
          if (routeSegments[i].startsWith(':')) {
            // Parameter match
            continue;
          }
  
          match = false;
          break;
        }
  
        if (match) {
          return true;
        }
      }
  
      return false;
   
}

