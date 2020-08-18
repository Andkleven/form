import React, { useState, useEffect } from "react";
import { confirmAlert } from "react-confirm-alert";
import { Modal, Button } from "react-bootstrap";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { Prompt, useHistory } from "react-router-dom";

export const DialogModal = ({
  title,
  message,
  buttons,
  show = true,
  setShow = () => {},
  block = false,
  setBlock = () => {},
  setConfirmed = () => {}
}) => {
  // Prompt if user tries to close window
  if (block) {
    window.onbeforeunload = confirmExit;
    function confirmExit() {
      return "You might have unsaved changes or a task in progress. Are you sure you want to leave?";
    }
  }

  // Regular modal dialog
  return (
    <Modal show={show} onHide={() => {}}>
      {title && (
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>{message || "Choose an option:"}</Modal.Body>
      <Modal.Footer>
        {buttons &&
          buttons.map((button, index) => {
            return (
              <Button
                {...button}
                key={`${title}-dialog-modal-button-${index}-${button.label}`}
                onClick={() => {
                  if (button.onClick()) {
                    setBlock(false);
                    setConfirmed(true);
                  }
                  setShow(false);
                }}
                className="w-100"
              >
                {button.label}
              </Button>
            );
          })}
        <Button
          variant="secondary"
          onClick={() => setShow(false)}
          className="w-100"
        >
          Abort
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const RouteGuard = ({ when, ...options }) => {
  const [show, setShow] = useState(false);
  const [path, setPath] = useState("");
  const [block, setBlock] = useState(when);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    setBlock(when);
  }, [when]);

  let history = useHistory();

  const navigate = () => {
    history.push(path);
  };

  const handleBlockedNavigation = path => {
    if (block) {
      setPath(path);
      setShow(true);
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (confirmed) {
      navigate();
    }
  });

  return (
    <>
      <Prompt when={block} message={e => handleBlockedNavigation(e.pathname)} />
      <DialogModal
        show={show}
        setShow={setShow}
        block={block}
        setBlock={setBlock}
        setConfirmed={setConfirmed}
        {...options}
      ></DialogModal>
    </>
  );
};

/**
 * https://www.npmjs.com/package/react-confirm-alert
 */
export const dialog = options => {
  confirmAlert({
    customUI: ({ onClose }) => {
      return <DialogModal setShow={onClose} {...options}></DialogModal>;
    }
  });
};
