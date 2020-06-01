import React, { useState } from "react";
import ItemUpdate from "pages/leadEngineer/ItemUpdate";
import { Button, ButtonGroup, Modal } from "react-bootstrap";
import DepthButton from "components/button/DepthButton";
import DepthButtonGroup from "components/button/DepthButtonGroup";
import GeneralButton from "components/button/GeneralButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default props => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="h-100">
      <DepthButtonGroup
        key={props.id}
        className="w-100 h-100"
        style={{ padding: "2px 2px" }}
      >
        <DepthButton
          size="sm"
          // icon={["fas", "cube"]}
          tooltip={`Open "${props.item.itemId}"`}
          iconSize="sm"
          // buttonSize="sm"
          className="btn d-flex justify-content-left align-items-center h-100 text-left text-truncate w-100"
          onClick={props.submitItem.bind(this, props.item)}
        >
          {props.item.itemId || <i className="text-secondary">Unnamed</i>}
        </DepthButton>
        <DepthButton
          size="sm"
          tooltip="Rename"
          short
          icon={["fas", "pen"]}
          iconSize="sm"
          // iconStyle={{ color: "red" }}
          // buttonSize="sm"
          className="btn h-100 text-primary"
          onClick={handleShow}
        ></DepthButton>
        <DepthButton
          size="sm"
          tooltip="Delete"
          short
          icon={["fas", "trash"]}
          iconSize="sm"
          // iconStyle={{ color: "red" }}
          // buttonSize="sm"
          className="btn h-100 text-secondary"
          onClick={props.submitDelete.bind(this, props.item.id)}
        ></DepthButton>
      </DepthButtonGroup>
      <Modal centered show={show} onHide={handleClose}>
        <Modal.Body>
          <ItemUpdate
            {...props}
            edit
            id={props.item.id}
            value={props.item.itemId}
            done={handleClose}
            onCancel={handleClose}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};
