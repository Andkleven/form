import React from "react";
import { Container } from "react-bootstrap";
import Div100vh from "react-div-100vh";

export default props => (
  <Div100vh
    className={`shadow-sm p-0 m-0`}
    style={{
      height: "100rvh"
    }}
  >
    <div className="m-0 h-100" style={{ paddingTop: 54 }}>
      <div className="h-100 overflow-auto">
        <Container className="mt-sm-0 p-0 py-sm-3 h-100">
          {props.children}
        </Container>
      </div>
    </div>
  </Div100vh>
);
