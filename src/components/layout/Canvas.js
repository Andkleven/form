import React from "react";
import Header from "components/layout/Header";
import Container from "react-bootstrap/Container";

export default props => {
  return (
    <>
      <Header />
      <Container>{props.children}</Container>
    </>
  );
};
