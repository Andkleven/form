import React from "react";
import Button from "react-bootstrap/Button";
// import { touch } from "styles/device";

export default props => {
  const Content = () => {
    return (
      <>
        {/* <i className="far fa-check mr-1" /> */}
        <b>Submit</b>
      </>
    );
  };

  const DeviceButton = () => {
    // Make alternative/dynamic button styles here
    return (
      <Button
        {...props}
        type="submit"
        onClick={props.onClick}
        className="w-100 text-light py-2"
      >
        <Content />
      </Button>
    );
  };

  return (
    <div className="w-100 d-flex justify-content-center">
      <DeviceButton />
    </div>
  );
};
