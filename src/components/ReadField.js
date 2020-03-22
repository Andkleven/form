import React, { useContext } from "react";
import { FieldsContext, ChapterContext } from "./DocumentAndSubmit";
import { Form } from "react-bootstrap";
import ErrorMessage from "./ErrorMessage";
import Moment from "react-moment";
import { isStringInstance } from "./Functions";
import "../styles/styles.css";

export default props => {
  const fieldsContext = useContext(FieldsContext);
  const chapterContext = useContext(ChapterContext);
  // make it write field
  const handelClick = () => {
    if (!props.readOnly) {
      fieldsContext.setIsSubmited(false);
      chapterContext.setEditChapter(
        `${props.repeatStepList}-${props.fieldName}`
      );
      fieldsContext.setvalidationPassed({});
    }
  };
  return (
    <Form.Group
      className={props.textCenter ? "text-center" : ""}
      onClick={() => handelClick()}
    >
      <small>
        {" "}
        <strong>{props.label + ": "}</strong>
        {["date", "datetime-local"].includes(props.type) ? (
          <Moment
            parse={props.type === "date" ? "dd/MM/yyyy" : "dd/MM/yyyy HH:mm"}
          >
            {isStringInstance(props.value) ? null : props.value}
          </Moment>
        ) : (
          <>
            {props.value}
            {props.value === false && "✖"}
            {props.value === true && "✅"}
          </>
        )}
      </small>
      {props.subtext && props.writeChapter ? (
        <Form.Text className="text-muted">{props.subtext}</Form.Text>
      ) : null}
      {props.error ? (
        <ErrorMessage showMinMax={props.showMinMax} error={props.error} />
      ) : null}
    </Form.Group>
  );
};
