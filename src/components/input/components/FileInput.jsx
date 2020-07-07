import React, { useMemo } from "react";
import { useDropzone } from "react-dropzone";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out"
};

const activeStyle = {
  borderColor: "#2196f3"
};

const acceptStyle = {
  borderColor: "#00e676"
};

const rejectStyle = {
  borderColor: "#ff1744"
};

export default props => {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: "image/*,application/pdf",
    onDrop: acceptedFiles => {
      props.onChangeFile(acceptedFiles[0]);
    }
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }),
    [isDragActive, isDragReject, isDragAccept]
  );
  return (
    <div className={`p-3 border rounded`}>
      <section className="container px-0 mx-0">
        <div {...getRootProps({ style })}>
          <label htmlFor={props.label || props.prepend}>
            {props.value.name ||
              props.value ||
              "Drag and drop files, or click to upload"}
          </label>
          <input
            {...getInputProps()}
            id={props.label || props.prepend}
            name={props.label || props.prepend}
            type="file"
            style={{}}
            hidden
          />
        </div>
      </section>
    </div>
  );
};
