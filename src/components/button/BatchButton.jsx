import React from "react";
import DepthButton from "components/button/DepthButton";
import { InputGroup } from "react-bootstrap";

export default ({ batchClick }) => {
  if (batchClick) {
    return (
      <InputGroup.Append>
        <DepthButton
          className="bg-light text-secondary rounded-right"
          style={{ borderLeft: "none", marginLeft: 1 }}
          type="button"
          title="Batch"
          onClick={() => batchClick()}
        >
          Batch
        </DepthButton>
      </InputGroup.Append>
    );
  } else {
    return null;
  }
};
