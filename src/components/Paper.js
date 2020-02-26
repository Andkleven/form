import React from "react";
import { Container, Card } from "react-bootstrap";

export default props => (
  <Container className="mt-0 mt-sm-3 p-0">
    <Card className="shadow-sm" style={{ minHeight: "80vh", height: "100%" }}>
      <Card.Body>{props.children}</Card.Body>
    </Card>
  </Container>
);
