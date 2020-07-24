import React, { useState, useContext } from "react";
import {
  isMobile,
  // isTablet,
  isSafari,
  isChrome,
  isFirefox
} from "react-device-detect";
import Date from "components/input/components/Date";
import Datetime from "components/input/components/Datetime";
import NativeInput from "components/input/components/NativeInput";
import CheckInput from "components/input/components/CheckInput";
import SelectInput from "components/input/components/SelectInput";
import FileInput from "components/input/components/FileInput";
// import Duplicate from "components/input/widgets/Duplicate";
import { control } from "./functions/control.ts";
import { Form } from "react-bootstrap";
import TinyButton from "components/button/TinyButton";
// import { documentDateContext } from "components/form/Form";

const customLabelTypes = ["checkbox", "radio", "switch"];

export default ({ noComment = false, ...props }) => {
  if (props.type === "file") {
    noComment = true;
  }

  // TODO: See if input has comment
  const hasComment = false;

  const [showComment, setShowComment] = useState(hasComment);

  // const addComment = () => {
  //   setShowComment(true);
  // };
  // const deleteComment = () => {
  //   if (window.confirm("This will delete the comment. Are you sure?")) {
  //     setShowComment(false);
  //   }
  // };

  const BottomPart = props => {
    return <>{props.BigButtons}</>;
  };

  const Comment = props => {
    // const { documentDateDispatch } = useContext(documentDateContext);

    // let comment;
    // documentDateDispatch({
    //   type: "add",
    //   newState: comment,
    //   path: `${props.path}Comment`
    // });

    // TODO: Get saved comment
    const [comment, setComment] = useState("");

    return (
      <Form.Group
        controlId={`comment-group-${props.type}-${props.name}-${props.repeatStepList}`}
        className="ml-3 mt-3"
      >
        <Form.Label>Comment</Form.Label>
        <Form.Control
          id={`comment-${props.type}-${props.name}-${props.repeatStepList}`}
          as="textarea"
          rows="3"
          // style={{ resize: "none" }}
          style={{ minHeight: "3em" }}
          value={comment}
          onChange={e => {
            setComment(e.target.value);
          }}
        />
      </Form.Group>
    );
  };

  const InputContent = ({ ...props }) => {
    const [valid, feedback] = control(props);

    return (
      <>
        <InputType
          {...props}
          isValid={valid}
          isInvalid={[true, false].includes(valid) && !valid}
        />
        {!!feedback && (
          <div className={`text-${valid ? "success" : "danger"}`}>
            <small>{feedback}</small>
          </div>
        )}
        {showComment && <Comment />}
      </>
    );
  };

  return !customLabelTypes.includes(props.type) ? (
    <div {...props} className={props.className} style={props.style}>
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
          <div className={`${!props.label && "ml-auto"}`}>
            {!noComment && (
              <TinyButton
                // {...props}
                onClick={() => setShowComment(!showComment)}
                icon={["fas", `comment-${showComment ? "minus" : "plus"}`]}
                className={`text-${showComment ? "danger" : "info"}`}
                // iconSize="md"
                style={{ position: "relative", top: "2em" }}
                // tooltip={`${showComment ? "Remove" : "Add"} comment`}
              >
                {`${showComment ? "Delete" : "Add"} comment`}
              </TinyButton>
            )}
            {props.TinyButtons}
          </div>
        </div>
        <InputContent {...props} />
        <BottomPart {...props} />
      </div>
    </div>
  ) : (
    <div>
      <div className={props.tight ? "mb-0" : "mb-3"}>
        <InputContent {...props} />
        <BottomPart {...props} />
      </div>
    </div>
  );
};

const InputType = ({ ...props }) => {
  const isDateRelated = ["date", "datetime-local"].includes(props.type);
  const hasBadCalendar = [isSafari, isChrome, isFirefox].includes(true);
  const isDesktop = !isMobile;
  const useCustomDate = isDateRelated & hasBadCalendar & isDesktop;
  const readOnly = props.readOnlyFields ? props.readOnlyFields : props.readOnly;
  const disabled = readOnly;
  if (["checkbox", "radio", "switch"].includes(props.type)) {
    return <CheckInput {...props} />;
  } else if (useCustomDate) {
    if (props.type === "date") {
      return <Date {...props} />;
    } else if (props.type === "datetime-local") {
      return <Datetime {...props} readOnly={readOnly} />;
    }
  } else if (props.type === "select") {
    return <SelectInput {...props} disabled={disabled} />;
  } else if (props.type === "file") {
    return <FileInput {...props} />;
  } else {
    return <NativeInput {...props} readOnly={readOnly} />;
  }
};
