import React, { useContext, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import "../../../styles/styles.css";
import TinyButton from "../../../button/TinyButton";
import LightLine from "../../../design/LightLine";
import { convertDatetimeToString } from "../../../functions/datetime";
import {
  writeChapter,
  getProperties,
  getSpecComment
} from "../../../functions/general";
import { DocumentDataContext, ChapterContext } from "../../Form";
import objectPath from "object-path";
import { dialog } from "../../../div/Dialog";

export default ({
  display = false,
  readOnly,
  className,
  style,
  showMoreDefault = false,
  ...props
}) => {
  const lastInputUser = objectPath.get(
    props.backendData,
    `${props.path}UserField`
  );

  const [showMore, setShowMore] = useState(showMoreDefault);

  if (display) {
    readOnly = true;
  }
  const { documentData, documentDataDispatch, screenshotData } =
    !display && useContext(DocumentDataContext);
  const chapterContext = useContext(ChapterContext);

  const flipToWrite = () => {
    if (!display) {
      chapterContext.setEditChapter(
        `${props.repeatStepList}-${props.fieldName}`
      );
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
        onClick={() => {
          if (
            screenshotData &&
            screenshotData.current &&
            JSON.stringify(screenshotData.current) !==
              JSON.stringify(documentData.current)
          ) {
            dialog({
              message: "Do you want to save your changes?",
              buttons: [
                {
                  label: "Save and continue",
                  variant: "success",
                  type: "submit",
                  onClick: () => {
                    props.submitData(false);
                    flipToWrite();
                  }
                },
                {
                  label: "Discard and continue",
                  variant: "danger",
                  onClick: () => {
                    // TODO: Remove old data from form
                    // I tried this, to no luck:
                    documentDataDispatch({
                      type: "setState",
                      newState: props.backendData
                    });
                    flipToWrite();
                  }
                }
              ]
            });
          } else {
            flipToWrite();
          }
        }}
        // tooltip="Edit"
        icon={["fas", "pen"]}
        iconSize="sm"
        type="button"
      >
        Edit
      </TinyButton>
    ) : null;

  const TinyShowMoreButton = props =>
    lastInputUser || props.subtext ? (
      <TinyButton
        {...props}
        onClick={() => {
          setShowMore(!showMore);
        }}
        icon={["fas", "pen"]}
        iconSize="sm"
        type="button"
        className={showMore ? "text-danger" : "text-info"}
      >
        Info
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
    : getProperties(props.unit, props.jsonVariables);

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
            <div style={{ wordBreak: "break-word" }}>
              <div>{datetimeString}</div>
              {showMore && (
                <small>
                  {props.value && props.subtext ? (
                    <div className="text-muted">{props.subtext}</div>
                  ) : null}
                  {props.value ? (
                    <div className="text-muted">
                      {lastInputUser
                        ? `By ${lastInputUser}`
                        : "Default or calculated value"}
                    </div>
                  ) : null}
                </small>
              )}
            </div>
            <span className={`text-right ${showAboveBreakpoint()}`}>
              <TinyShowMoreButton />
              {readOnly ? null : (
                <TinyEditButton
                  {...props}
                  edit={props.edit && !props.notSingleEdit}
                />
              )}
            </span>
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
        <div style={{ wordBreak: "break-word" }}>
          {(props.type !== "checkbox" &&
            ![null, false, "null", undefined, ""].includes(props.value) &&
            `${props.value}${showUnit}`) ||
            (props.value === false && `―`) ||
            (props.value === true && props.type === "checkbox" && `✓`) || (
              <EmptyValue />
            )}
          {/* {objectPath.get(documentData.current, props.path)} */}
          {showMore && (
            <small>
              {props.value && props.subtext ? (
                <div className="text-muted">{props.subtext}</div>
              ) : null}
              {props.value ? (
                <div className="text-muted">
                  {lastInputUser
                    ? `By ${lastInputUser}`
                    : "Default or calculated value"}
                </div>
              ) : null}
            </small>
          )}
        </div>
        <span className={`text-right ${showAboveBreakpoint()}`}>
          <TinyShowMoreButton />
          {readOnly ? null : (
            <TinyEditButton
              {...props}
              edit={props.edit && !props.notSingleEdit}
            />
          )}
        </span>
      </div>
    );

  const savedComment = objectPath.get(
    props.backendData,
    `${props.path}Comment`,
    false
  );

  const leComment = getSpecComment(
    props.specData,
    props.specRemovePath,
    props.routeToSpecMax,
    props.routeToSpecMin,
    props.specValueList,
    props.repeatStepList,
    props.editRepeatStepValueList
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
        {!!savedComment && (
          <>
            <Col xs="12" sm="6" className={showAboveBreakpoint()}>
              <div className="text-muted">Comment</div>
            </Col>
            <Col xs="12" sm="6" className={showAboveBreakpoint()}>
              <div className="text-muted">"{savedComment}"</div>
            </Col>
          </>
        )}
        {!!leComment && (
          <>
            <Col xs="12" sm="6" className={showAboveBreakpoint()}>
              <div className="text-muted">Comment from Lead Engineer</div>
            </Col>
            <Col xs="12" sm="6" className={showAboveBreakpoint()}>
              <div className="text-muted">"{leComment}"</div>
            </Col>
          </>
        )}
        <Col className={`${showUnderBreakpoint()}`}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Label {...props} />
              <Value {...props} />
            </div>
            <span className="py-1">
              {lastInputUser || props.subtext ? (
                <div className="py-2">
                  <TinyShowMoreButton />
                </div>
              ) : null}
              {readOnly ? null : (
                <div className="py-2">
                  <TinyEditButton
                    {...props}
                    edit={props.edit && !props.notSingleEdit}
                  />
                </div>
              )}
            </span>
          </div>
        </Col>
        {!!savedComment && (
          <Col xs="12" className={`${showUnderBreakpoint()}`}>
            <div className="d-flex justify-content-between align-items-center text-muted">
              <div>
                <small>Comment</small>
                <div>"{savedComment}"</div>
              </div>
            </div>
          </Col>
        )}
        {!!leComment && (
          <Col xs="12" className={`${showUnderBreakpoint()}`}>
            <div className="d-flex justify-content-between align-items-center text-muted">
              <div>
                <small>Comment from Lead Engineer</small>
                <div>"{leComment}"</div>
              </div>
            </div>
          </Col>
        )}

        {!props.noLine && (
          <Col xs="12">
            <LightLine />
          </Col>
        )}
        {props.subtext &&
        writeChapter(
          props.allWaysShow,
          chapterContext.editChapter,
          props.thisChapter,
          chapterContext.finalChapter.current
        ) ? (
          <Form.Text className="text-muted">{props.subtext}</Form.Text>
        ) : null}
      </Row>
    </div>
  );
};
