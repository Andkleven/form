import React, { useContext } from "react";
import { FieldsContext } from "./DocumentAndSubmit";
import { Form } from "react-bootstrap";
import ErrorMessage from "./ErrorMessage";

import "../styles/styles.css";

export default props => {
  const fieldsContext = useContext(FieldsContext);
  // make it write field
  const handelClick = () => {
    if (!props.readOnly) {
      fieldsContext.setEditField(props.indexId);
      fieldsContext.setvalidationPassed({});
    }
  };
  return (
    <Form.Group
      className={props.textCenter ? "text-center" : ""}
      onClick={() => {
        handelClick();
      }}
    >
      <small>
        {" "}
        <strong>{props.label + ": "}</strong>
        {props.value}
        {props.value === false && "✖"}
        {props.value === true && "✅"}
      </small>
      {props.subtext ? (
        <Form.Text className="text-muted">{props.subtext}</Form.Text>
      ) : null}
      <ErrorMessage
        showMinMax={props.showMinMax}
        error={props.error}
        isSubmited={props.isSubmited}
      />
    </Form.Group>
  );
};
