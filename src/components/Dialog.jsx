// import React, { useState } from "react";
import { confirmAlert } from "react-confirm-alert";
// import { Modal, Button } from "react-bootstrap";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

// export const DialogModal = () => {
//   const [show, setShow] = useState(true);

//   return (
//     <Modal show={show} onHide={setShow(false)}>
//       <Modal.Header closeButton>
//         <Modal.Title>Modal heading</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={setShow(false)}>
//           Cancel
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

/**
 * https://www.npmjs.com/package/react-confirm-alert
 */
export const dialog = options => {
  confirmAlert({
    ...options
  });
};
