import React from "react";
import Input from "components/input/Input";
import ReadField from "components/form/components/fields/ReadField";
import TinyButton from "components/button/TinyButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default props => {
  return (
    <>
      <div className={props.writeChapter && "pt-2"}>
        <div className="d-flex justify-content-between">
          <div>
            <FontAwesomeIcon
              icon={["fad", "file-image"]}
              className="text-primary text-center mr-2 shadow-sm"
              style={{
                "--fa-primary-opacity": "0.4",
                "--fa-secondary-opacity": "1.0"
              }}
              // swapOpacity
            />
            {props.file.file.name}
          </div>
          {props.writeChapter && (
            <TinyButton
              onClick={() => props.deleteHandler(props.index)}
              icon="trash-alt"
              color="danger"
              tooltip={`Delete "${props.file.file.name}"`}
              noPadding
            />
          )}
        </div>
      </div>
      {props.description &&
        (props.writeChapter ? (
          <div className="mt-2">
            <Input
              placeholder={`Description or comment...`}
              value={props.file.fileDescription}
              onChange={e => props.onChange(e.target, props.index)}
            />
          </div>
        ) : (
          props.file.fileDescription && (
            <ReadField
              {...props}
              key={props.indexId}
              readOnly={true}
              label="Description"
              value={
                props.file.fileDescription ? props.file.fileDescription : ""
              }
            />
          )
        ))}
    </>
  );
};