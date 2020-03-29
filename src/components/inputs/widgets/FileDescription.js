import React from "react";
import Input from "components/Input";
import TinyButton from "components/TinyButton";
export default props => {
  console.log(props.value);
  return (
    <>
      <div className="pb-2">
        <i
          className="fad fa-file-image text-primary text-center mr-2 shadow-sm"
          style={{
            "--fa-primary-opacity": "0.4",
            "--fa-secondary-opacity": "1.0"
          }}
        />
        {props.file.name}
        <TinyButton
          onClick={() => props.deleteHandler(props.index)}
          content={"❌"}
        />
      </div>
      {props.description && (
        <div className="">
          <Input
            placeholder={`Description or comment...`}
            className=""
            value={props.value}
            onChange={e => props.onChange(e.target, props.index)}
          />
        </div>
      )}
    </>
  );
};
