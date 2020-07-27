import React, { useState, useCallback } from "react";
import { Button, Container } from "react-bootstrap";
import Paper from "components/layout/Paper";
import { useSpring, animated } from "react-spring";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams, useLocation } from "react-router-dom";

export default () => {
  const [show, setShow] = useState(true);
  //   const [show, setShow] = useState(false);
  const [height, setHeight] = useState(0);

  const measuredRef = useCallback(node => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  const hiddenLength = height + 10;

  const paperSpring = useSpring({
    to: {
      position: "relative",
      bottom: show ? 0 : hiddenLength
    },
    from: {
      position: "relative",
      bottom: hiddenLength
    }
    // config: {
    //   friction: 100,
    //   mass: 0.25
    // }
  });

  const buttonHeight = 30;

  const buttonSpring = useSpring({
    to: {
      position: "relative",
      bottom: show ? buttonHeight : 0
    },
    from: {
      position: "relative",
      bottom: 0
    }
    // config: {
    //   friction: 100,
    //   mass: 0.25
    // }
  });

  const Info = () => {
    let params = useParams();

    return (
      <div>
        <pre>{JSON.stringify(params, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div
      style={{ position: "fixed", zIndex: 1 }}
      className="w-100 d-flex justify-content-center"
    >
      <Container>
        <div
          style={{ height: 0, position: "relative", bottom: 0, zIndex: 1 }}
          //   className="px-3"
        >
          <animated.div style={paperSpring} className="">
            <div ref={measuredRef}>
              <Paper>
                <Info></Info>
              </Paper>
            </div>
            <animated.div style={buttonSpring}>
              <div
                className="d-flex justify-content-end"
                style={{ position: "relative", bottom: 0 }}
              >
                <Button
                  variant="primary"
                  onClick={() => {
                    setShow(!show);
                  }}
                  style={{ height: buttonHeight, width: buttonHeight }}
                  className="d-flex align-items-center justify-content-center shadow-sm"
                >
                  <FontAwesomeIcon
                    icon={["fas", show ? "times" : "info"]}
                    // className="mr-2"
                    size="sm"
                    style={{}}
                  />
                  {/* <small>{`${show ? "Hide" : "Show"} overview`}</small> */}
                </Button>
              </div>
            </animated.div>
          </animated.div>
        </div>
      </Container>
    </div>
  );
};
