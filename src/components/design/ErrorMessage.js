import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default props => {
  const error = props.error.message;

  return (
    <div
      className={`d-flex justify-content-center w-100 text-white m-0 p-0 ${props.className}`}
    >
      <div
        className="text-center border rounded p-3 m-0 bg-danger w-100"
        style={{ maxWidth: 400 }}
      >
        {props.children}
        {props.big && (
          <FontAwesomeIcon
            icon={["fad", "exclamation-triangle"]}
            className="mb-3"
            size="3x"
          />
        )}
        {props.big && <h6>Something went wrong!</h6>}
        {typeof error === "string" ? (
          <>
            <div className="text-center">{error}</div>
          </>
        ) : (
          <>
            <div className="mb-2">
              Sadly, no error message was received from the server, so we don't
              know why.
            </div>
            <div className="mb-0">
              The server might be unavailable or this computer may be
              disconnected from the internet.
            </div>
          </>
        )}
      </div>
    </div>
  );
};
