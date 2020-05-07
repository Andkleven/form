import React from "react";
import { ButtonGroup, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// GUIDE
// - onClick -
// Use props "onClickDuplicate", "onClickDelete" and "onClickNew" to control onClick events
//
// - Show Buttons -
// Pass props "new", "duplicate" and "delete" like so:
// <Input duplicate delete/>
// or if you want it to be dynamic:
// <Input duplicate={someVariable} delete={someOtherVariable} />

const ButtonShell = props => (
  <OverlayTrigger
    overlay={
      <Tooltip hidden={props.tooltip ? false : true}>{props.tooltip}</Tooltip>
    }
  >
    <Button
      {...props}
      variant={props.variant}
      className="border"
      onClick={props.onClick}
    >
      <div
        className={`d-flex justify-content-center align-items-center ${
          props.variant === "primary" && "text-light"
        }`}
      >
        <FontAwesomeIcon
          icon={props.icon}
          className={`position-relative d-flex align-items-center`}
          style={{ width: "1.2em", height: "1.5em", top: "0.05em" }}
        />
        {props.icon && props.children ? (
          <div className="d-none d-sm-inline ml-1">{props.children}</div>
        ) : (
          props.children
        )}
      </div>
    </Button>
  </OverlayTrigger>
);

export default props => {
  const DuplicateButton = () => (
    <ButtonShell
      {...props}
      variant="primary"
      icon="clone"
      onClick={props.onClickDuplicate}
    >
      Duplicate
    </ButtonShell>
  );

  const DeleteButton = () => (
    <ButtonShell
      {...props}
      variant="secondary"
      icon="trash"
      onClick={props.onClickDelete}
    >
      Delete
    </ButtonShell>
  );

  const NewButton = () => (
    <ButtonShell
      {...props}
      variant="primary"
      icon="sparkles"
      onClick={props.onClickNew}
    >
      New
    </ButtonShell>
  );

  return (
    <ButtonGroup className={`${props.className} w-100`}>
      {props.new === true && <NewButton />}
      {props.duplicate === true && <DuplicateButton />}
      {props.delete === true && <DeleteButton />}
    </ButtonGroup>
  );
};
