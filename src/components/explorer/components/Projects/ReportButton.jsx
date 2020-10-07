import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import ReportViewer, { ReportDownload } from "components/report/Report";
import { isMobile } from "react-device-detect";

export const ReportButton = ({ project, description, item, ...props }) => {
  // const openPdf = () => {
  //   return null;
  // };

  // Switch these for development
  const [show, setShow] = useState(item.itemId === "HD-2-A10-34");
  // const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button {...props} onClick={handleShow}>
        {props.children}
      </Button>
      <Modal
        animation={false}
        centered
        size="lg"
        show={show}
        onHide={handleClose}
      >
        <Modal.Body
        // Comment to make modal scrollable
        // style={{ maxHeight: "100vh" }}
        >
          {isMobile ? (
            <div className="text-secondary">
              Preview not yet available on mobile.
            </div>
          ) : (
            <ReportViewer
              project={project}
              description={description}
              item={item}
            ></ReportViewer>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex w-100">
            <ReportDownload
              variant="success"
              className="w-100"
              onClick={() => null}
              disabled
              project={project}
              description={description}
              item={item}
            >
              Download
            </ReportDownload>
            <div className="ml-2"></div>
            <Button variant="secondary" className="w-100" onClick={handleClose}>
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};
