import React from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "react-bootstrap";

export default props => {
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

  const focusedStyle = {
    borderColor: "#f0a741",
    backgroundColor: "rgba(240, 167, 65, 0.125)",
    color: "#f0a741"
  };

  const onDrop = acceptedFiles => {
    props.onChangeFile(acceptedFiles[0]);
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    isFocused
  } = useDropzone({
    onDrop,
    accept: "image/*"
  });

  const style = () => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {}),
    ...(isFocused ? focusedStyle : {})
  });
  // [isDragActive, isDragReject, isDragAccept, isFocused]

  const deleteFile = () => {
    props.onChangeFile();
  };

  return (
    <div className={`p-3 border rounded`}>
      <section className="container px-0 mx-0">
        <div {...getRootProps({ style })}>
          <div
            // htmlFor={props.label || props.prepend}
            className="text-center"
            style={{
              wordBreak: "break-word",
              margin: 0
            }}
          >
            {!!(props.value.name || props.value) && "File uploaded: "}
            {props.value.name ||
              props.value ||
              "Drag and drop files, or click to upload"}
          </div>
          {!!(props.value.name || props.value) && (
            <div
              className="text-center mt-3"
              style={{
                wordBreak: "break-word"
              }}
            >
              Drag and drop files, or click to overwrite
            </div>
          )}
          <input
            {...getInputProps({
              capture: "camera",
              multiple: false
            })}
            id={props.label || props.prepend}
            name={props.label || props.prepend}
            type="file"
            style={{}}
            hidden
          />
        </div>
      </section>
      {!!(props.value.name || props.value) && (
        <Button className="mt-3 w-100" variant="danger" onClick={deleteFile}>
          Delete File
        </Button>
      )}
    </div>
  );
};
