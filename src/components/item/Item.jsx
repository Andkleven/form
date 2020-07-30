import React, { useState } from "react";
import ItemUpdate from "pages/leadEngineer/ItemUpdate";
import { Modal } from "react-bootstrap";
import DepthButton from "components/button/DepthButton";
import DepthButtonGroup from "components/button/DepthButtonGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default ({ item, unique, submitItem, submitDelete, id, ...props }) => {
  const [showRename, setShowRename] = useState(false);
  const handleCloseRename = () => setShowRename(false);
  const handleShowRename = () => setShowRename(true);

  return (
    <div className="h-100">
      <DepthButtonGroup
        key={`item-${item.itemId}`}
        className="w-100 h-100"
        style={{ padding: "2px 2px" }}
      >
        <DepthButton
          size="sm"
          tooltip={`Open "${item.itemId}"`}
          className="btn d-flex justify-content-left align-items-center h-100 text-left text-truncate w-100"
          onClick={() => submitItem(item)}
        >
          <div className="d-flex justify-content-between w-100">
            <div>
              {item.itemId || <i className="text-secondary">Unnamed</i>}
            </div>
            {item.unique && (
              <div className="text-secondary">
                <FontAwesomeIcon icon={["fas", "fingerprint"]} />
                <i className="ml-2 d-none d-sm-inline">Unique</i>
              </div>
            )}
          </div>
        </DepthButton>
        <DepthButton
          size="sm"
          tooltip="Rename"
          short
          iconProps={{ icon: ["fas", "pen"], size: "sm", maxHeight: "100%" }}
          className="btn text-primary"
          onClick={handleShowRename}
        ></DepthButton>
        <DepthButton
          size="sm"
          tooltip="Delete"
          short
          iconProps={{ icon: ["fas", "trash"], size: "sm", maxHeight: "100%" }}
          className="btn text-danger"
          // onClick={submitDelete.bind(this, item.id)}
          onClick={() => {
            window.confirm("This is irreversible - are you sure?") &&
              submitDelete(item.id);
          }}
        ></DepthButton>
      </DepthButtonGroup>
      <Modal centered show={showRename} onHide={handleCloseRename}>
        <Modal.Body>
          <ItemUpdate
            {...props}
            edit
            id={item.id}
            item
            value={item.itemId}
            onDone={handleCloseRename}
            onCancel={handleCloseRename}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};
