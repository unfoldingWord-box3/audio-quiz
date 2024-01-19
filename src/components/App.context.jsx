import React, { useState } from "react";
import PropTypes from "prop-types";

export const AppContext = React.createContext();

export function AppContextProvider({ children }) {
  const [html, setHtml] = useState("")

  const [errorMessage, setErrorMessage] = useState()

  // create the value for the context provider
  const context = {
    state: {
      html,
      errorMessage
    },
    actions: {
      setHtml,
      setErrorMessage,
    },
  };

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
}

AppContextProvider.propTypes = {
  /** Children to render inside of Provider */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
