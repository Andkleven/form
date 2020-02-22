import React, { useCallback, useEffect, useMemo, useContext } from "react";
import { useDropzone } from "react-dropzone";

import { FilesContext } from "../page/canvas";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "10px",
  borderWidth: 2,
  borderRadius: 4,
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

const FilesUpload = props => {
  const filesContext = useContext(FilesContext);
  let fileString = props.file ? "file" : props.multipleFiles ? "files" : "file";
  const deleteFile = useCallback(filePath => {
    filesContext.setFiles(
      filesContext.files.filter(file => file.name !== filePath)
    );
  }, []);

  useEffect(() => {
    if (props.file) {
      filesContext.setFiles([props.file]);
    }
  }, [props.file]);

  const onDrop = useCallback(acceptedFiles => {
    if (props.file || !props.multipleFiles) {
      filesContext.setFiles([acceptedFiles[0]]);
    } else {
      filesContext.setFiles(prevState => [...prevState, ...acceptedFiles]);
    }
  }, []);

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({ onDrop });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }),
    [isDragActive, isDragReject]
  );

  const fileList = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path}
      {/* {file.size} */}
    </li>
  ));

  return (
    <>
      <div className="p-3 border rounded">
        <div {...getRootProps({ style })} className="">
          <input {...getInputProps()} />
          <p className="mb-0">Drag 'n' drop files, or click to upload.</p>
        </div>
        {fileList.length ? (
          <aside>
            <label className="mt-3">Uploaded files</label>
            <hr className="w-100 mt-0 mb-2" />
            <ul>{fileList}</ul>
          </aside>
        ) : null}
      </div>
    </>
  );
};

export default FilesUpload;
