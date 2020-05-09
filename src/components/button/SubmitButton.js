import React from "react";
import Button from "react-bootstrap/Button";

export default props => {
  const Content = () => {
    return <>Submit</>;
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
