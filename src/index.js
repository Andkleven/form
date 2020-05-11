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
  uri: "http://127.0.0.1:8000/graphql/"
  // uri: "https://versjon2.herokuapp.com/graphql/",
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
