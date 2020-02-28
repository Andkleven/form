import React from "react";
import { Container, Card } from "react-bootstrap";
import Div100vh from "react-div-100vh";

export default props => (
  <>
    <Div100vh
      className={`shadow-sm p-0 m-0`}
      style={{
        height: "100rvh",
        borderRadius: 5,
        color: props.darkMode && "#d5d5d5"
      }}
    >
      <div className="m-0 h-100" style={{ paddingTop: 54 }}>
        <div className="h-100 overflow-auto">
          <Container className="mt-0 p-0 py-sm-3 h-100">
            <Card
              className={`shadow-sm ${props.darkMode && "bg-dark"}`}
              style={{
                minHeight: "100%",
                // borderRadius: 5,
                color: props.darkMode && "#d5d5d5"
              }}
            >
              <Card.Body className="h-100">{props.children}</Card.Body>
              <p className="text-muted text-center">
                <i
                  className="fal fa-copyright position-relative"
                  style={{ fontSize: ".95em" }}
                />{" "}
                {"Trelleborg "}
                {new Date().getFullYear()}
              </p>
            </Card>
          </Container>
        </div>
      </div>
    </Div100vh>
  </>
);
