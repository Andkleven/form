import React, { useState } from "react";
// import {
// isMobile,
// isTablet,
// isSafari,
// isChrome,
// isFirefox
// } from "react-device-detect";
// import Date from "components/input/components/Date";
// import Datetime from "components/input/components/Datetime";
import NativeInput from "components/input/components/NativeInput";
import CheckInput from "components/input/components/CheckInput";
import SelectInput from "components/input/components/SelectInput";
import objectPath from "object-path";
// import Duplicate from "components/input/widgets/Duplicate";
import { control } from "./functions/control.ts";
import { Form } from "react-bootstrap";
import { focusNextInput } from "./functions/general";
import TinyButton from "components/button/TinyButton";
import MultipleFiles from "components/input/components/MultipleFiles";
import { useSpring, animated } from "react-spring";
import FileInput from "components/input/components/FileInput";

const InputShell = ({
  noComment,
  hasComment,
  showComment,
  setShowComment,
  documentDataDispatch,
  batchClick,
  ...props
}) => {
  const customLabelTypes = ["checkbox", "radio", "switch"];

  return !customLabelTypes.includes(props.type) ? (
    <div className={props.className} style={props.style}>
      <div className={props.tight ? "mb-0" : "mb-3"}>
        <div className="d-flex justify-content-between align-items-center">
          {(props.label || props.prepend) && (
            <label
              htmlFor={`custom-${props.type}-${props.label}-${props.repeatStepList}`}
              hidden={
                !["date", "datetime"].includes(props.type) &&
                !!props.prepend &&
                !props.label
              }
            >
              {props.label || props.prepend}
            </label>
          )}
          {(props.TinyButtons || !noComment) && (
            <div
              className={`${!props.label && "ml-auto"}`}
              style={{ marginBottom: "9px" }}
            >
              {!noComment && (
                <TinyButton
                  // {...props}
                  onClick={() => {
                    if (showComment && hasComment) {
                      if (
                        window.confirm(
                          "The comment will be gone forever. Are you sure?"
                        )
                      ) {
                        setShowComment(!showComment);
                        documentDataDispatch({
                          type: "add",
                          newState: "",
                          path: `${props.path}Comment`,
                          notReRender: true
                        });
                      }
                    } else {
                      setShowComment(!showComment);
                    }
                  }}
                  icon={["fas", `comment-${showComment ? "minus" : "plus"}`]}
                  className={`text-${showComment ? "danger" : "info"}`}
                  // iconSize="md"
                  // tooltip={`${showComment ? "Remove" : "Add"} comment`}
                  style={{ position: "relative", top: "2em" }}
                >
                  {`${showComment ? "Delete" : "Add"} comment`}
                </TinyButton>
              )}
              {batchClick && (
                <TinyButton
                  // {...props}
                  onClick={batchClick}
                  // icon={["fas", `comment-${showComment ? "minus" : "plus"}`]}
                  className={`text-dark`}
                  // iconSize="md"
                  // tooltip={`${showComment ? "Remove" : "Add"} comment`}
                  style={{ position: "relative", top: "2em" }}
                >
                  Batch
                </TinyButton>
              )}
              {props.TinyButtons}
            </div>
          )}
        </div>
        {props.children}
        {props.BigButtons}
      </div>
    </div>
  ) : (
    <div>
      <div className={props.tight ? "mb-0" : "mb-3"}>
        {props.children}
        {props.BigButtons}
      </div>
    </div>
  );
};

const Comment = ({ onKeyPress, onChange, defaultValue, ...props }) => {
  return (
    <Form.Group
      controlId={`comment-group-${props.type}-${props.name}-${props.repeatStepList}`}
      className="ml-3 mt-3"
    >
      <Form.Label>Comment</Form.Label>
      <Form.Control
        as="textarea"
        rows="3"
        style={{ resize: "none" }}
        defaultValue={defaultValue}
        onChange={onChange}
        onKeyPress={onKeyPress}
      />
    </Form.Group>
  );
};

const InputType = props => {
  // const isDateRelated = ["date", "datetime-local"].includes(props.type);
  // const hasBadCalendar = [isSafari, isChrome, isFirefox].includes(true);
  // const isDesktop = !isMobile;
  // const useCustomDate = isDateRelated & hasBadCalendar & isDesktop;
  const readOnly = props.readOnlyFields ? props.readOnlyFields : props.readOnly;
  const disabled = readOnly;
  if (["checkbox", "radio", "switch"].includes(props.type)) {
    return <CheckInput {...props} />;
  } else if (props.type === "select") {
    return <SelectInput {...props} disabled={disabled} />;
  } else if (props.type === "file") {
    return <FileInput {...props} />;
  } else if (props.type === "files") {
    return <MultipleFiles {...props} />;
  } else {
    return <NativeInput {...props} readOnly={readOnly} />;
  }
};

export default ({
  noComment = false,
  nextOnEnter = true,
  documentData,
  documentDataDispatch,
  ...props
}) => {
  // if (props.type === "file") {
  //   noComment = true;
  // }

  // Enter focuses on next input or submit button,
  // instead of submitting
  const onKeyPress = e => {
    if (["Enter"].includes(e.key) && nextOnEnter) {
      focusNextInput(e);
    }
  };

  const savedComment = objectPath.get(
    props.backendData,
    `${props.path}Comment`,
    false
  );

  const [showComment, setShowComment] = useState(!!savedComment);
  const [hasComment, setHasComment] = useState(!!savedComment);

  const [valid, feedback] = control(props);

  const commentSpring = useSpring({
    from: {
      // opacity: 0
      transform: "scale(0.75, 0.50)"
    },
    to: {
      // opacity: showComment ? 1 : 0
      transform: showComment ? "scale(1, 1)" : "scale(0.75, 0)"
    },
    config: {
      tension: 450,
      friction: 25,
      // clamp: true,
      mass: 0.75
    }
  });

  return (
    <InputShell
      {...props}
      className={props.className ? props.className.toString() : null}
      style={props.style}
      noComment={noComment}
      hasComment={hasComment}
      showComment={showComment}
      setShowComment={setShowComment}
      documentDataDispatch={documentDataDispatch}
    >
      <InputType
        {...props}
        isValid={props.isValid || valid}
        isInvalid={props.isInvalid || ([true, false].includes(valid) && !valid)}
        onKeyPress={onKeyPress}
      />
      {!!feedback && (
        <div className={`text-${valid ? "success" : "danger"}`}>
          <small>{feedback}</small>
        </div>
      )}
      <animated.div style={commentSpring}>
        {showComment && (
          <Comment
            documentData={documentData}
            onKeyPress={onKeyPress}
            onChange={e => {
              setHasComment(!!e.target.value || !!savedComment);
              documentDataDispatch({
                type: "add",
                newState: e.target.value,
                path: `${props.path}Comment`,
                notReRender: true
              });
            }}
            defaultValue={objectPath.get(
              documentData.current,
              `${props.path}Comment`,
              ""
            )}
          />
        )}
      </animated.div>
    </InputShell>
  );
};
