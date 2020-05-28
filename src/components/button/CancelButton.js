import React from "react";
import Button from "react-bootstrap/Button";

export default props => {
  const DefaultContent = () => {
    return <>Cancel</>;
  };

  const DeviceButton = () => {
    // Make alternative/dynamic button styles here
    return (
      <Button
        {...props}
        variant="secondary"
        type="submit"
        onClick={props.onClick}
        className="w-100 py-2"
      >
        {props.children || <DefaultContent />}
      </Button>
    );
  };

  return (
    <div className="w-100 d-flex justify-content-center">
      <DeviceButton />
    </div>
  );
};
