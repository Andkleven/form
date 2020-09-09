import React, { useState } from "react";
import ItemUpdate from "components/item/ItemUpdate";
import { Modal } from "react-bootstrap";
import DepthButton from "components/button/DepthButton";
import DepthButtonGroup from "components/button/DepthButtonGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSpring, animated } from "react-spring";

export default ({ item, unique, submitItem, submitDelete, id, ...props }) => {
  const spring = useSpring({
    from: {
      transform: "scale(0.75, 0)"
    },
    to: {
      transform: "scale(1, 1)"
    },
    config: {
      tension: 500,
      friction: 20,
      // clamp: true,
      mass: 1
    }
  });

  const [showRename, setShowRename] = useState(false);
  const handleCloseRename = () => setShowRename(false);
  const handleShowRename = () => setShowRename(true);

  return (
    <animated.div style={spring} className="h-100">
      <div className="h-100">
        <DepthButtonGroup
          outerClass="h-100"
          key={`item-${item.itemId}`}
          className="w-100 h-100"
          style={{ padding: "2px 2px" }}
        >
          <DepthButton
            size="sm"
            tooltip={`Open "${item.itemId}"`}
            className="btn h-100 text-left w-100"
            onClick={() => submitItem(item)}
          >
            <div className="w-100 h-100 d-flex justify-content-between align-items-center">
              <div
                style={{ wordBreak: "break-word" }}
                className="h-100 d-flex align-items-center"
              >
                {item.itemId || <i className="text-secondary">Unnamed</i>}
              </div>
              {item.unique && (
                <div className="text-secondary">
                  {/* <FontAwesomeIcon icon={["fas", "fingerprint"]} /> */}
                  <i className="ml-2 d-none d-sm-inline">Unique</i>
                </div>
              )}
            </div>
          </DepthButton>
          <DepthButton
            size="sm"
            tooltip="Rename"
            short
            iconProps={{ icon: ["fas", "pen"], size: "sm", maxheight: "100%" }}
            className="btn text-primary"
            onClick={handleShowRename}
          ></DepthButton>
          <DepthButton
            size="sm"
            tooltip="Delete"
            short
            iconProps={{
              icon: ["fas", "trash"],
              size: "sm",
              maxheight: "100%"
            }}
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
    </animated.div>
  );
};
