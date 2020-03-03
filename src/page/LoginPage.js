import React, { useState } from "react";
import { AUTH_TOKEN } from "../constants";
import { useMutation } from "@apollo/react-hooks";
import history from "../history";
import gql from "graphql-tag";
// import { getAllPosts } from "@apollo/react-hooks";

import { Form, Button, Image } from "react-bootstrap";
import styled from "styled-components";
import "../styles/bootstrap.css";
import emblem from "../images/trelleborg_emblem.png";

const LOGIN_MUTATION = gql`
  mutation LoginMutation($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
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

export default () => {
  let token;
  async function pushHome(data) {
    token = await data.tokenAuth;
    localStorage.setItem(AUTH_TOKEN, token);
    // console.log("Starting push to home...");
    history.push(`/`);
    // console.log("Push done.");
  }
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [
    login,
    { loading: mutationLoading, error: mutationError }
  ] = useMutation(LOGIN_MUTATION, {
    onCompleted: data => {
      pushHome(data);
    }
  });

  return (
    <>
      <OuterLogin>
        <link
          rel="stylepages"
          href="https://kit-pro.fontawesome.com/releases/latest/css/pro.min.css"
          media="all"
        />
        <div
          className="rounded shadow-lg bg-dark"
          // style={{ backgroundColor: "rgba(0, 0, 0, .7)" }}
        >
          <div className="p-3 w-100" style={{ maxWidth: "15em" }}>
            <div className="w-100 d-flex">
              <Image
                src={emblem}
                className="mb-3 py-2 mx-auto"
                style={{ width: "8em" }}
              />
            </div>
            <Form
              onSubmit={e => {
                e.preventDefault();
                login({
                  variables: { username, password }
                })
                  .then(response => {
                    // console.log(response);
                  })
                  .catch(e => {
                    console.log(e);
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
                  autoComplete="new-password"
                  onChange={e => setPassword(e.target.value)}
                />
              </Form.Group>
              {(mutationLoading || mutationError) && (
                <div className="text-light w-100">
                  <div className="bg-secondary p-2 rounded mb-1 shadow border">
                    {mutationLoading && <div>Loading...</div>}
                    {mutationError && <>{`${mutationError}`}</>}
                  </div>
                </div>
              )}
              <Button
                variant="primary"
                className="w-100 mb-3 text-light"
                type="submit"
              >
                <i
                  className="fas fa-sign-in position-relative"
                  style={{ fontSize: "1.5em", top: 2 }}
                />
              </Button>

              <p className="mb-0 text-muted text-center">
                <i
                  className="fas fa-copyright position-relative"
                  style={{ fontSize: ".95em" }}
                />{" "}
                {new Date().getFullYear()} Trelleborg
              </p>
            </Form>
          </div>
        </div>
      </OuterLogin>
    </>
  );
};
