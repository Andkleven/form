import React from "react";
import ReactDOM from "react-dom";
import "./styles/styles.css";
import "./styles/trelleborg-bootstrap.scss";
import App from "./App";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";
import { AUTH_TOKEN, USER } from "./constants";

import { createUploadLink } from "apollo-upload-client";
import Config from "components/Config.tsx";
import mutations from "graphql/mutation";
import query from "graphql/query";
import Math from "functions/math.js";
import stages from "config/stages.json";

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
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "network-only"
    }
  }
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Config
      mutations={mutations}
      query={query}
      user={USER}
      mathCollection={Math}
      stages={stages}
    >
      <App />
    </Config>
  </ApolloProvider>,
  document.getElementById("root")
);
