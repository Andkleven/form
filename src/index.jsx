import React from "react";
import ReactDOM from "react-dom";
import "./styles/styles.css";
import "./styles/trelleborg-bootstrap.scss";
import App from "./App";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";
import { AUTH_TOKEN } from "./constants";

import { createUploadLink } from "apollo-upload-client";

const httpLink = createUploadLink({
  // See README for how to setup backend
  uri: `${process.env.REACT_APP_BACKEND}/graphql/`
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `JWT ${token}` : ""
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
