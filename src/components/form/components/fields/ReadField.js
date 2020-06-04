import React, { useContext } from "react";
import { ChapterContext } from "components/form/Form";
import { Form, Row, Col } from "react-bootstrap";
import "styles/styles.css";
import TinyButton from "components/button/TinyButton";
import LightLine from "components/design/LightLine";
import { convertDatetimeToString } from "functions/datetime";

export default ({ display = false, readOnly, className, style, ...props }) => {
  if (display) {
    readOnly = true;
  }

  const chapterContext = useContext(ChapterContext);

  const flipToWrite = () => {
    // if (window.confirm("Are you sure you wish to edit?")) {
    if (!display) {
      chapterContext.setEditChapter(
        `${props.repeatStepList}-${props.fieldName}`
      );
    }
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
      icon={["fas", "pen"]}
      iconSize="sm"
      tooltip="Edit"
    />
  );

  // const BigEditButton = props => (
  //   <Button {...props} onClick={() => flipToWrite()} icon="pencil">
  //     {/* {props.children} */}
  //   </Button>
  // );

  const Label = props => {
    if (typeof props.label === "string") {
      return (
        <div
          className={`d-flex justify-content-between align-items-start h-100`}
        >
          <div className={showUnderBreakpoint()}>
            <small className="text-secondary">{`${props.label}`}</small>
          </div>
          <div className={showAboveBreakpoint()}>{`${props.label}`}</div>
        </div>
      );
    } else if (typeof props.label === "object") {
      return props.label;
    }
  };

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
            {readOnly ? null : (
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
          (props.value === true && props.type === "checkbox" && `✓`) || (
            <EmptyValue />
          )}
        {readOnly ? null : <TinyEditButton className={showAboveBreakpoint()} />}
      </div>
    );

  return (
    <Row className={className} style={style}>
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
          {readOnly ? null : <TinyEditButton />}
        </div>
      </Col>
      {!props.noLine && (
        <Col xs="12">
          <LightLine />
        </Col>
      )}
      {props.subtext && props.writeChapter ? (
        <Form.Text className="text-muted">{props.subtext}</Form.Text>
      ) : null}
    </Row>
  );
};
