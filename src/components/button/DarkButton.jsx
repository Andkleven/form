import React from "react";
import GeneralButton from "./GeneralButton";

export default props => {
  return (
    <GeneralButton
      type="reset"
      variant="darkLight"
      style={{
        borderColor: "rgb(32, 36, 40)"
      }}
      className="shadow-sm"
      {...props}
    />
  );
};
