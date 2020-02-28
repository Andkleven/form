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

function FileInput(props) {
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({ accept: "image/*" });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }),
    [isDragActive, isDragReject]
  );

  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path}
      {/* {file.size} */}
    </li>
  ));

  return (
    <>
      <label>{props.label}</label>
      <div className="p-3 border rounded">
        <section className="container px-0">
          <div {...getRootProps({ style })} className="">
            <input {...getInputProps()} />
            <p className="mt-2">Drag 'n' drop files, or click to upload.</p>
          </div>
          {files.length ? (
            <aside>
              <label className="mt-3">Uploaded files</label>
              <hr className="w-100 mt-0 mb-2" />
              <ul>{files}</ul>
            </aside>
          ) : null}
        </section>
      </div>
    </>
  );
}

export default FileInput;
