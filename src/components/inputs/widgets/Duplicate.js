import React from "react";
import { ButtonGroup, Button, OverlayTrigger, Tooltip } from "react-bootstrap";

function Duplicate(props) {
  return (
    <ButtonGroup>
      {props.duplicate && (
        <OverlayTrigger overlay={<Tooltip>Duplicate input field</Tooltip>}>
          <Button variant="light" className="border ml-1" style={{ zIndex: 0 }}>
            <div className="d-flex align-items-center text-dark">
              <i className="far fa-clone" style={{ width: "1.2em" }} />
            </div>
          </Button>
        </OverlayTrigger>
      )}
      {props.isDuplicated && (
        <OverlayTrigger overlay={<Tooltip>Delete input field</Tooltip>}>
          <Button variant="light" className="border" style={{ zIndex: 0 }}>
            <div className="d-flex align-items-center text-dark">
              <i className="far fa-trash" style={{ width: "1.2em" }} />
            </div>
          </Button>
        </OverlayTrigger>
      )}
    </ButtonGroup>
  );
}

export default Duplicate;
