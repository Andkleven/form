import React, { useState } from "react";
import ItemUpdate from "pages/leadEngineer/ItemUpdate";
import { Button, ButtonGroup, Modal } from "react-bootstrap";
import DepthButton from "components/button/DepthButton";
import DepthButtonGroup from "components/button/DepthButtonGroup";
import GeneralButton from "components/button/GeneralButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default props => {
  const [showRename, setShowRename] = useState(false);

  const handleCloseRename = () => setShowRename(false);
  const handleShowRename = () => setShowRename(true);

  return (
    <div className="h-100">
      <DepthButtonGroup
        key={props.id}
        className="w-100 h-100"
        style={{ padding: "2px 2px" }}
      >
        <DepthButton
          size="sm"
          tooltip={`Open "${props.item.itemId}"`}
          className="btn d-flex justify-content-left align-items-center h-100 text-left text-truncate w-100"
          onClick={props.submitItem.bind(this, props.item)}
        >
          {props.item.itemId || <i className="text-secondary">Unnamed</i>}
        </DepthButton>
        <DepthButton
          size="sm"
          tooltip="Rename"
          short
          iconProps={{ icon: ["fas", "pen"], size: "sm" }}
          className="btn h-100 text-primary"
          onClick={handleShowRename}
        ></DepthButton>
        <DepthButton
          size="sm"
          tooltip="Delete"
          short
          iconProps={{ icon: ["fas", "trash"], size: "sm" }}
          className="btn h-100 text-secondary"
          // onClick={props.submitDelete.bind(this, props.item.id)}
          onClick={() => {
            window.confirm("This is irreversible - are you sure?") &&
              props.submitDelete(props.item.id);
          }}
        ></DepthButton>
      </DepthButtonGroup>
      <Modal centered show={showRename} onHide={handleCloseRename}>
        <Modal.Body>
          <ItemUpdate
            {...props}
            edit
            id={props.item.id}
            value={props.item.itemId}
            onDone={handleCloseRename}
            onCancel={handleCloseRename}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};
