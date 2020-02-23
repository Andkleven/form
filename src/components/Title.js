import React from "react";
import Line from "./Line";

export default props => {
  return (
    <>
      {props.title ? (
        <>
          <br />
          <br />
          <h1 className="text-center">{props.title}</h1>
          <Line />
        </>
      ) : null}
    </>
  );
};
