import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import ReportViewer, {
  ReportDownload,
  ReportsViewer
} from "components/report/Report";
import { isMobile } from "react-device-detect";
import Link from "components/design/fonts/Link";
import Input from "components/input/Input";
import DepthButton from "components/button/DepthButton";

export const ReportButton = ({ project, description, item, ...props }) => {
  // const openPdf = () => {
  //   return null;
  // };

  // Switch these for development
  // const [show, setShow] = useState(item.itemId === "15400");
  const [show, setShow] = useState(false);

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
            />
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

export const ReportsButton = ({ project, done, ...props }) => {
  // const openPdf = () => {
  //   return null;
  // };

  // Switch these for development
  // const [show, setShow] = useState(item.itemId === "15400");
  const [show, setShow] = useState(false);
  const handleShow = () => {
    setShow(true);
    setShowOptions(false);
  };
  const handleClose = () => setShow(false);

  const [showOptions, setShowOptions] = useState(false);
  const handleShowOptions = () => setShowOptions(true);
  const handleCloseOptions = () => setShowOptions(false);

  const [filter, setFilter] = useState("");

  return (
    <>
      <Link {...props} onClick={done ? handleShow : handleShowOptions}>
        {props.children}
      </Link>
      <Modal
        animation={false}
        centered
        size="lg"
        show={showOptions}
        onHide={handleCloseOptions}
      >
        <Modal.Body
          // Comment to make modal scrollable
          style={{ borderRadius: 2 }}
          className="bg-dark"
        >
          <Button
            variant="primary"
            className="w-100 mb-1"
            onClick={e => {
              handleShow(e);
              setFilter("");
            }}
          >
            All items
          </Button>
          <Button
            variant="success"
            className="w-100 mb-1"
            onClick={e => {
              handleShow(e);
              setFilter("done");
            }}
          >
            Completed items only
          </Button>
          <Button
            variant="secondary"
            className="w-100"
            onClick={handleCloseOptions}
          >
            Close
          </Button>
        </Modal.Body>
      </Modal>
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
            <ReportsViewer project={project} filter={filter} />
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex w-100">
            {/* <ReportDownload
              variant="success"
              className="w-100"
              onClick={() => null}
              disabled
              project={project}
              description={description}
              item={item}
            >
              Download
            </ReportDownload> */}
            {/* <div className="ml-2"></div> */}
            <Button variant="secondary" className="w-100" onClick={handleClose}>
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};
