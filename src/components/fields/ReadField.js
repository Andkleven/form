import React, { useContext } from "react";
import { FieldsContext, ChapterContext } from "../DocumentAndSubmit";
import { Form, Row, Col, Button } from "react-bootstrap";
import ErrorMessage from "../ErrorMessage";
import "styles/styles.css";
import TinyButton from "components/buttons/TinyButton";
import LightLine from "components/layout/design/LightLine";
import { convertDatetimeToString } from "functions/datetime";

export default props => {
  const fieldsContext = useContext(FieldsContext);
  const chapterContext = useContext(ChapterContext);

  const flipToWrite = () => {
    // if (window.confirm("Are you sure you wish to edit?")) {
    fieldsContext.setIsSubmitted(false);
    chapterContext.setEditChapter(`${props.repeatStepList}-${props.fieldName}`);
    fieldsContext.setValidationPassed({});
    // }
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

  // const BigEditButton = props => (
  //   <Button {...props} onClick={() => flipToWrite()} icon="pencil">
  //     {/* {props.children} */}
  //   </Button>
  // );

  const Label = props => (
    <div className={`d-flex justify-content-between align-items-start h-100`}>
      <div className={showUnderBreakpoint()}>
        <small className="text-secondary">{`${props.label}`}</small>
      </div>
      <div className={showAboveBreakpoint()}>{`${props.label}`}</div>
    </div>
  );

  const showUnit = [undefined, null, "", false].includes(props.unit)
    ? ""
    : props.unit;

  const EmptyValue = () => (
    <div className="text-secondary">
      <em>―</em>
    </div>
  );

  const DateValue = () => {
    if (["date", "datetime-local"].includes(props.type)) {
      const datetimeString = convertDatetimeToString(
        props.value,
        props.type
      ) || <EmptyValue />;

      return (
        <>
          <div
            className={`d-flex justify-content-between align-items-start h-100`}
          >
            <div>{datetimeString}</div>
            {props.readOnly ? null : (
              <TinyEditButton className={showAboveBreakpoint()} />
            )}
          </div>
        </>
      );
    }
    return false;
  };

  const Value = props =>
    DateValue() || (
      <div className={`d-flex justify-content-between align-items-start h-100`}>
        {(props.type !== "checkbox" &&
          ![null, false, "null", undefined, ""].includes(props.value) &&
          `${props.value}${showUnit}`) ||
          (props.value === false && `Not performed`) ||
          (props.value === true &&
            props.type === "checkbox" &&
            `Performed`) || <EmptyValue />}
        {props.readOnly ? null : (
          <TinyEditButton className={showAboveBreakpoint()} />
        )}
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
          {props.readOnly ? null : <TinyEditButton />}
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
