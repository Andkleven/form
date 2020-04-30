import React from "react";
import BounceLoader from "react-spinners/BounceLoader";

export default (
  <div className="text-center">
    <p>Loading...</p>
    <div className="d-flex justify-content-center w-100">
      <BounceLoader color="#dddddd" size="2em" />
    </div>
  </div>
);
