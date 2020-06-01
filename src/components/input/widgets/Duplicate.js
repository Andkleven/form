import React from "react";
import { ButtonGroup, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// GUIDE
// - onClick -
// Use props onClickDuplicate and onClickDelete to control onClick events
//
// - Show Buttons -
// Pass props duplicate and delete like so:
// <Input duplicate delete/>
// or if you want it to be dynamic:
// <Input duplicate={someVariable} delete={someOtherVariable} />

export default props => {
  const DuplicateButton = (
    <OverlayTrigger
      delay={{ show: 1000, hide: 0 }}
      overlay={<Tooltip>Duplicate input field</Tooltip>}
    >
      <Button
        variant="light"
        className="border ml-1"
        style={{ zIndex: 0 }}
        onClick={props.addHandler}
      >
        <div className="d-flex align-items-center text-dark">
          <FontAwesomeIcon icon="clone" style={{ width: "1.2em" }} />
        </div>
      </Button>
    </OverlayTrigger>
  );

  const DeleteButton = (
    <OverlayTrigger
      delay={{ show: 1000, hide: 0 }}
      overlay={<Tooltip>Delete input field</Tooltip>}
    >
      <Button
        variant="light"
        className="border"
        style={{ zIndex: 0 }}
        onClick={props.deleteHandler(props.repeatStep)}
      >
        <div className="d-flex align-items-center text-dark">
          <FontAwesomeIcon icon="trash" style={{ width: "1.2em" }} />
        </div>
      </Button>
    </OverlayTrigger>
  );

  return (
    <ButtonGroup>
      <DuplicateButton />
      {props.delete && <DeleteButton />}
    </ButtonGroup>
  );
};
