import React, { useContext } from "react";
import { FieldsContext, ChapterContext } from "./DocumentAndSubmit";
import { Form, Row, Col, Button } from "react-bootstrap";
import ErrorMessage from "./ErrorMessage";
// import Moment from "react-moment";
import { isStringInstance } from "./Functions";
import "../styles/styles.css";
import TinyButton from "components/TinyButton";

export default props => {
  const fieldsContext = useContext(FieldsContext);
  const chapterContext = useContext(ChapterContext);
  // make it write field
  const flipToWrite = () => {
    if (!props.readOnly) {
      fieldsContext.setIsSubmited(false);
      chapterContext.setEditChapter(
        `${props.repeatStepList}-${props.fieldName}`
      );
      fieldsContext.setvalidationPassed({});
    }
  };

  const DateValue = () => {
    // if (["date", "datetime-local"].includes(props.type)) {
    //   return (
    //     // <Moment
    //     //   parse={props.type === "date" ? "dd/MM/yyyy" : "dd/MM/yyyy HH:mm"}
    //     // >
    //     //   {/* Good to have when dealing with dates */}
    //     //   {isStringInstance(props.value) ? null : props.value}
    //     //   TEST
    //     // </Moment>
    //   // );
    // }
    return false;
  };

  const Value = () =>
    DateValue() || (
      <Col xs="6">
        <div className="d-flex justify-content-between align-items-end">
          <div className={props.className}>
            {props.value}
            {props.value === false && `Not performed`}
            {props.value === true && `Performed`}
          </div>
          <TinyButton
            onClick={() => flipToWrite()}
            icon="pencil-alt"
            color="dark"
          />
        </div>
      </Col>
    );

  const Label = () => (
    <Col xs="6">
      <div className="d-flex justify-content-between align-items-end">
        {`${props.label}`}
      </div>
    </Col>
  );

  return (
    <Row className={`${props.textCenter ? "text-center" : ""}`}>
      <Label />
      <Value />
      <Col>
        <hr className="p-0 m-0" style={{ borderColor: "#eef5ff" }} />
      </Col>
      {props.subtext && props.writeChapter ? (
        <Form.Text className="text-muted">{props.subtext}</Form.Text>
      ) : null}
      {props.error ? (
        <ErrorMessage showMinMax={props.showMinMax} error={props.error} />
      ) : null}
    </Row>
  );
};
