import React, { useState } from "react";
import ItemUpdate from "pages/leadEngineer/ItemUpdate";
import { Button, ButtonGroup } from "react-bootstrap";
import GeneralButton from "components/button/GeneralButton";

export default props => {
  const [show, setShow] = useState(false);
  return (
    <li key={props.id}>
      <div>{props.item.id}</div>
      <div>{props.item.itemId}</div>
      <div>
        <ButtonGroup className="w-100">
          <GeneralButton
            icon={["far", "cube"]}
            iconStyle={{ position: "relative", bottom: ".05em" }}
            iconSize="sm"
            buttonSize="sm"
            className="btn"
            onClick={props.submitItem.bind(this, props.item)}
          >
            Open
          </GeneralButton>
          <GeneralButton
            icon={["far", "edit"]}
            iconStyle={{ position: "relative", bottom: ".05em" }}
            iconSize="sm"
            buttonSize="sm"
            className="btn"
            onClick={() => setShow(true)}
          >
            Rename
          </GeneralButton>
          <GeneralButton
            icon={["far", "trash"]}
            iconStyle={{ position: "relative", bottom: ".1em" }}
            iconSize="sm"
            buttonSize="sm"
            className="btn"
            onClick={props.submitDelete.bind(this, props.item.id)}
          >
            Delete
          </GeneralButton>
        </ButtonGroup>
        {show && (
          <>
            <ItemUpdate
              {...props}
              id={props.item.id}
              value={props.item.itemId}
              done={() => setShow(false)}
            />
            <button className="btn" onClick={() => setShow(false)}>
              cancel
            </button>
          </>
        )}
      </div>
    </li>
  );
};
