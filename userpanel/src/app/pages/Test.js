import React from 'react';

const Test = () => {
  const url = '/users/123/2';
  const routes = [
    '/users',
    '/users/:id',
    '/posts/:year/:month/:day'
  ];

  const matchRoute = () => {
    for (let route of routes) {
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
  };

  const isMatch = matchRoute();

  console.log(`URL: ${url}`);
  console.log('Routes:');
  console.log(routes);
  console.log(`Matching Route: ${isMatch}`);

  return <div></div>;
};

export default Test;
