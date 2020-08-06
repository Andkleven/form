import React, { useContext } from "react";
import { Form, Row, Col } from "react-bootstrap";
import "styles/styles.css";
import TinyButton from "components/button/TinyButton";
import LightLine from "components/design/LightLine";
import { convertDatetimeToString } from "functions/datetime";
import { documentDataContext, ChapterContext } from "components/form/Form";
import objectPath from "object-path";
import { dialog } from "components/Dialog";

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
      if (
        // window.confirm("You will lose unsaved changes, are you sure?")
        dialog({
          message: "Do you want to save your changes?",
          buttons: [
            {
              label: "Save and continue",
              variant: "success",
              type: "submit",
              onClick: () => {
                props.submitData(documentData.current, false);
                if (!display) {
                  chapterContext.setEditChapter(
                    `${props.repeatStepList}-${props.fieldName}`
                  );
                }
              }
            },
            {
              label: "Discard and continue",
              variant: "danger",
              onClick: () => {
                props.setState(objectPath.get(props.data, props.path))
                documentData.documentDataDispatch({
                  type: "add",
                  newState: objectPath.get(props.data, props.path),
                  path: props.path
                });
                chapterContext.setEditChapter(0);
                if (!display) {
                  chapterContext.setEditChapter(
                    `${props.repeatStepList}-${props.fieldName}`
                  );
                }
              }
            }
          ]
        })
      ) {
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
    (!props.label && !!props.prepend && props.indent !== false) || props.indent;

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
            className={`d-flex justify-content-between align-items-start h-100 ${
              indent && "ml-3 ml-sm-0"
              }`}
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
          indent && "ml-3 ml-sm-0"
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

  const savedComment = objectPath.get(
    props.backendData,
    `${props.path}Comment`,
    false
  );

  return (
    <div
      className={className}
      style={style}
    // hidden={readOnly}
    >
      <Row>
        <Col xs="12" sm="6" className={showAboveBreakpoint()}>
          <Label {...props} />
        </Col>
        <Col xs="12" sm="6" className={showAboveBreakpoint()}>
          <Value {...props} />
        </Col>
        {savedComment && (
          <>
            <Col xs="12" sm="6" className={showAboveBreakpoint()}>
              <div className="text-muted">Comment</div>
            </Col>
            <Col xs="12" sm="6" className={showAboveBreakpoint()}>
              <div className="text-muted">"{savedComment}"</div>
            </Col>
          </>
        )}
        <Col className={`${showUnderBreakpoint()}`}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Label {...props} />
              <Value {...props} />
            </div>
            {readOnly ? null : <TinyEditButton edit={props.edit} />}
          </div>
        </Col>
        {savedComment && (
          <Col xs="12" className={`${showUnderBreakpoint()}`}>
            <div className="d-flex justify-content-between align-items-center text-muted">
              <div>
                <small>Comment</small>
                <div>"{savedComment}"</div>
              </div>
            </div>
          </Col>
        )}

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
