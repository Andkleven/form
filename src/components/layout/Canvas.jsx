import React from "react";
import Header from "components/layout/Header";
import Container from "react-bootstrap/Container";
import Footer from "components/layout/Footer";

export default ({ showForm = false, ...props }) => {
  return (
    <div className="content">
      <Header />
      {!!showForm && (
        <Container className="p-0 mt-n3 mt-sm-0">{props.children}</Container>
      )}
      <Footer className="d-none d-sm-inline" />
    </div>
  );
};
