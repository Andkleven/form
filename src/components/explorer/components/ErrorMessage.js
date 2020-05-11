import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default error => (
  <div className="d-flex justify-content-center w-100">
    <div
      className="text-center border rounded p-3 bg-danger"
      style={{ maxWidth: 400 }}
    >
      <FontAwesomeIcon
        icon={["fad", "exclamation-triangle"]}
        className="mb-3"
        size="fa-3x"
      />
      <h6>Something went wrong!</h6>
      {typeof error === "string" ? (
        <>
          <div className="text-center">Error message from the sever:</div>
          <div className="text-center">{error}</div>
        </>
      ) : (
        <>
          <div className="mb-2">
            Sadly, no error message was received from the server, so we don't
            know why.
          </div>
          <div className="mb-0">
            The server might be unavailable or this computer may be disconnected
            from the internet.
          </div>
        </>
      )}
    </div>
  </div>
);