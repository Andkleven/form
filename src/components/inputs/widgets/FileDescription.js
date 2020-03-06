import React from "react";
import Input from "../../Input";

export default props => {
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
        {props.file.key}
      </div>
      <div className="">
        <Input
          placeholder={`Description or comment...`}
          className=""
          onChange={props.onChange}
        />
      </div>
    </>
  );
};
