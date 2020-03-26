import React, { useContext } from "react";
import { FieldsContext, ChapterContext } from "./DocumentAndSubmit";
import { Form, Row, Col, Button } from "react-bootstrap";
import ErrorMessage from "./ErrorMessage";
import Moment from "react-moment";
import { isStringInstance } from "./Functions";
import "../styles/styles.css";
import TinyButton from "components/TinyButton";
import LightLine from "components/LightLine";

export default props => {
  const fieldsContext = useContext(FieldsContext);
  const chapterContext = useContext(ChapterContext);

  const flipToWrite = () => {
    fieldsContext.setIsSubmited(false);
    chapterContext.setEditChapter(`${props.repeatStepList}-${props.fieldName}`);
    fieldsContext.setvalidationPassed({});
  };

  const DateValue = () => {
    if (["date", "datetime-local"].includes(props.type)) {
      return (
        <>
          <Moment
            parse={props.type === "date" ? "dd/MM/yyyy" : "dd/MM/yyyy HH:mm"}
          >
            {/* Good to have when dealing with dates */}
            {isStringInstance(props.value) ? null : props.value}
            TEST
          </Moment>
          {props.readOnly ? null : (
            <TinyButton
              onClick={() => flipToWrite()}
              icon="pencil-alt"
              color="dark"
            />
          )}
        </>
      );
    }
    return false;
  };

  const breakpoint = "sm";

  const showUnderBreakpoint = () => {
    return `d-inline d-${breakpoint}-none`;
  };

  const showAboveBreakpoint = () => {
    return `d-none d-${breakpoint}-inline`;
  };

  const TinyEditButton = props => (
    <TinyButton
      {...props}
      onClick={() => flipToWrite()}
      icon="pencil"
      tooltip="Edit"
    />
  );

  const BigEditButton = props => (
    <Button {...props} onClick={() => flipToWrite()} icon="pencil">
      {/* {props.children} */}
    </Button>
  );

  const Value = props =>
    DateValue() || (
      <div className="d-flex justify-content-between align-items-end">
        {props.value ||
          (props.value === false && `Not performed`) ||
          (props.value === true && `Performed`) || (
            <div className="text-danger">Not registered</div>
          )}
        <TinyEditButton
          className={`justify-self-end ${showAboveBreakpoint()}`}
        />
      </div>
    );

  const Label = props => (
    <div className="d-flex justify-content-between align-items-end">
      <div className={showUnderBreakpoint()}>
        <small className="text-secondary">{`${props.label}`}</small>
      </div>
      <div className={showAboveBreakpoint()}>{`${props.label}`}</div>
    </div>
  );

  return (
    <Row>
      <Col xs="12" sm="6" className={showAboveBreakpoint()}>
        <Label {...props} />
      </Col>
      <Col xs="12" sm="6" className={showAboveBreakpoint()}>
        <Value {...props} />
      </Col>
      <Col className={`${showUnderBreakpoint()}`}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <Label {...props} />
            <Value {...props} />
          </div>
          <BigEditButton
            className="h-100 border text-secondary"
            variant="light"
          >
            {/* <i className="fal fa-pencil mr-1" /> */}
            Edit
          </BigEditButton>
        </div>
      </Col>
      <Col xs="12">
        <LightLine />
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
