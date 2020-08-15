import { useMutation } from "@apollo/react-hooks";
import { AUTH_TOKEN, USER } from "constants.js";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
// import { getAllPosts } from "@apollo/react-hooks";
import { Button, Form, Image } from "react-bootstrap";
import styled from "styled-components";
// import history from "../functions/history";
import emblem from "../images/emblem.png";
import Copyright from "components/design/Copyright";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loading from "components/Loading";
// import { Redirect } from "react-router-dom";

const LOGIN_MUTATION = gql`
  mutation LoginMutation($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
      user {
        role
      }
    }
  }
`;

const OuterLogin = styled.div`
  height: 90vh;
  display: -ms-flexbox;
  display: -webkit-box;
  display: flex;
  -ms-flex-align: center;
  -ms-flex-pack: center;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
`;

let loggedIn = localStorage.getItem(AUTH_TOKEN);

export default () => {
  const [token, setToken] = useState();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (loggedIn) {
    localStorage.removeItem(AUTH_TOKEN);
    localStorage.removeItem(USER);
  }
  async function saveToken(data) {
    let newToken = await data.tokenAuth.token;
    let user = await data.tokenAuth.user;
    setToken(newToken);
    localStorage.setItem(AUTH_TOKEN, newToken);
    localStorage.setItem(USER, JSON.stringify({ username, ...user }));
  }

  const [
    login,
    { loading: mutationLoading, error: mutationError }
  ] = useMutation(LOGIN_MUTATION, {
    onError: () => {},
    onCompleted: data => {
      saveToken(data);
    }
  });

  useEffect(() => {
    if (token) {
      window.location.href = "/";
    }
  }, [token]);

  return (
    <>
      <OuterLogin>
        <div
          className="rounded shadow-lg bg-dark"
          // style={{ backgroundColor: "rgba(0, 0, 0, .7)" }}
        >
          <div className="p-3 w-100" style={{ maxWidth: "15em" }}>
            <div className="w-100 d-flex">
              <Image
                src={emblem}
                className="mb-3 py-2 mx-auto"
                style={{ width: "5em", height: "100%" }}
              />
            </div>
            <Form
              onSubmit={e => {
                e.preventDefault();
                login({
                  variables: { username, password }
                });
              }}
            >
              <Form.Group controlId="formUsername" className="mb-1 rounded-0">
                <Form.Control
                  type="text"
                  placeholder="Username"
                  value={username}
                  autoComplete="username"
                  onChange={e => setUsername(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formPassword" className="mb-1 rounded-0">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  // autoComplete="new-password"
                  onChange={e => setPassword(e.target.value)}
                />
              </Form.Group>
              {(mutationLoading || mutationError) && (
                <div className="text-light w-100">
                  <div className="bg-secondary p-2 rounded mb-1 shadow border">
                    {mutationLoading && <Loading />}
                    {mutationError && <>{`${mutationError}`}</>}
                  </div>
                </div>
              )}
              <Button
                variant="primary"
                className="w-100 mb-3 text-light"
                type="submit"
              >
                <FontAwesomeIcon
                  icon={["fal", "sign-in"]}
                  size="lg"
                  className="position-relative mr-2"
                  // style={{ fontSize: "1.5em", top: 2 }}
                />
                Login
              </Button>
            </Form>
            <Copyright align="center" className="text-muted" />
          </div>
        </div>
      </OuterLogin>
    </>
  );
};
