import React, { useContext } from "react";
import { Form, Row, Col } from "react-bootstrap";
import "styles/styles.css";
import TinyButton from "components/button/TinyButton";
import LightLine from "components/design/LightLine";
import { convertDatetimeToString } from "functions/datetime";
import { documentDataContext, ChapterContext } from "components/form/Form";

export default ({ display = false, readOnly, className, style, ...props }) => {
  if (display) {
    readOnly = true;
  }
  const documentData = useContext(documentDataContext);
  const chapterContext = useContext(ChapterContext);

  const flipToWrite = () => {
    if (
      JSON.stringify(documentData.documentData.current) ===
      JSON.stringify(props.backendData)
    ) {
      if (!display) {
        chapterContext.setEditChapter(
          `${props.repeatStepList}-${props.fieldName}`
        );
      }
    } else {
      if (window.confirm("You will lose unsaved changes, are you sure?")) {
        if (!display) {
          chapterContext.setEditChapter(
            `${props.repeatStepList}-${props.fieldName}`
          );
        }
      }
    }
  };

  const breakpoint = "sm";

  const showUnderBreakpoint = () => {
    return `d-inline d-${breakpoint}-none`;
  };

  const showAboveBreakpoint = () => {
    return `d-none d-${breakpoint}-inline`;
  };
  const TinyEditButton = props =>
    props.edit ? (
      <TinyButton
        {...props}
        onClick={() => flipToWrite()}
        icon={["fas", "pen"]}
        iconSize="sm"
        // tooltip="Edit"
      >
        Edit
      </TinyButton>
    ) : null;

  // const BigEditButton = props => (
  //   <Button {...props} onClick={() => flipToWrite()} icon="pencil">
  //     {/* {props.children} */}
  //   </Button>
  // );

  const indent =
    (!props.label && props.prepend && props.indent !== false) || props.indent;

  const Label = props => {
    if (typeof props.label === "string") {
      return (
        <div
          className={`d-flex justify-content-between align-items-start h-100 ${
            indent && `ml-3`
          }`}
        >
          <div className={`${showUnderBreakpoint()}`}>
            <small className={`text-secondary`}>
              {
                // (props.math && <div className="ml-3">{props.label}</div>) ||
                props.label || props.prepend
              }
            </small>
          </div>
          <div className={showAboveBreakpoint()}>
            {
              // (props.math && <div className="ml-3">{props.label}</div>) ||
              props.label || props.prepend
            }
          </div>
        </div>
      );
    } else if (typeof props.label === "object") {
      return props.label;
    }
    return null;
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
              <TinyEditButton
                className={showAboveBreakpoint()}
                edit={props.edit}
              />
            )}
          </div>
        </>
      );
    }
    return false;
  };

  const Value = props =>
    DateValue() || (
      <div
        className={`d-flex justify-content-between align-items-start h-100 ${
          (!props.label && "ml-3 ml-sm-0") || (props.indent && "ml-3")
        }`}
      >
        <div>
          {(props.type !== "checkbox" &&
            ![null, false, "null", undefined, ""].includes(props.value) &&
            `${props.value}${showUnit}`) ||
            (props.value === false && `―`) ||
            (props.value === true && props.type === "checkbox" && `✓`) || (
              <EmptyValue />
            )}
          <small>
            {/* {props.value && props.max ? (
              <div className="text-muted">Max: {props.max}</div>
            ) : null}
            {props.value && props.min ? (
              <div className="text-muted">Min: {props.min}</div>
            ) : null} */}
            {props.value && props.subtext ? (
              <div className="text-muted">{props.subtext}</div>
            ) : null}
          </small>
        </div>
        {readOnly ? null : (
          <TinyEditButton className={showAboveBreakpoint()} edit={props.edit} />
        )}
      </div>
    );

  return (
    <div className={className} style={style}>
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
            {readOnly ? null : <TinyEditButton edit={props.edit} />}
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
    </div>
  );
};
