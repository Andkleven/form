import React from "react";

export default props => {
  return (
    <>
      {props.title ? (
        <>
          <h5>{props.title}</h5>
        </>
      ) : null}
    </>
  );
};
