// src/components/PrivateRoute.js
import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.js';

/**
 * PrivateRoute component.
 *
 * @param {Object} props - The component props.
 * @param {React.Component} props.component - The component to render if the user is authenticated.
 * @param {Object} rest - The remaining props to pass to the Route component.
 * @returns {React.Component} - The rendered component based on the authentication status.
 */
function PrivateRoute({ component: Component, ...rest }) {
  const { authTokens } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={(props) =>
        authTokens ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}

export default PrivateRoute;
