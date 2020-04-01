import React from "react";
import Input from "components/Input";
import ReadField from "components/ReadField";
import TinyButton from "components/buttons/TinyButton";
export default props => {
  return (
    <>
      <div className="pt-2">
        <i
          className="fad fa-file-image text-primary text-center mr-2 shadow-sm"
          style={{
            "--fa-primary-opacity": "0.4",
            "--fa-secondary-opacity": "1.0"
          }}
        />
        {props.file.file.name}
        {props.writeChapter && (
          <TinyButton
            onClick={() => props.deleteHandler(props.index)}
            icon="trash-alt"
          />
        )}
      </div>
      {props.description && (
        <div className="">
          {props.writeChapter ? (
            <Input
              placeholder={`Description or comment...`}
              className=""
              value={props.file.fileDescription}
              onChange={e => props.onChange(e.target, props.index)}
            />
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
          )}
        </div>
      )}
    </>
  );
};
