import React from "react";
import Header from "layout/Header";
import Container from "react-bootstrap/Container";
import Footer from "layout/Footer";

export default ({ showForm = true, ...props }) => {
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
