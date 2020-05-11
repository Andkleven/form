import React, { useMemo, useState, useEffect, useContext } from "react";
import { useDropzone } from "react-dropzone";
import FileDescription from "../widgets/FileDescription";
import objectPath from "object-path";
import { DocumentDateContext } from "components/form/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  const {documentDate, documentDateDispatch} = useContext(DocumentDateContext);
  const [files, setFiles] = useState([]);
  
  // test
  useEffect(() => {
    if (!props.singleFile) {
      let oldFiles = objectPath.get(
        documentDate,
        props.path
      );
      if (oldFiles) {
        setFiles(
          oldFiles.map(oldFile => ({
            ...oldFile,
            file: { name: oldFile.file.split("/")[1] }
          }))
        );
      }
    }
  }, [props.path, props.singleFile, documentDate]);

  useEffect(() => {
    documentDateDispatch({type: 'add', path: props.path, newState: files});
  }, [files, props.path, documentDateDispatch]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: "image/*",
    onDrop: acceptedFiles => {
      if (props.singleFile) {
        objectPath.set(
          documentDate,
          props.path,
          acceptedFiles[0]
        );
      } else {
        setFiles(prevState => {
          acceptedFiles.forEach(file => {
            prevState.push({ file: file });
          });
          return [...prevState];
        });
      }
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

  const onChange = (value, index) => {
    setFiles(prevState => {
      prevState[index] = { ...prevState[index], fileDescription: value.value };
      return [...prevState];
    });
  };

  const deleteHandler = index => {
    setFiles(prevState => {
      prevState.splice(index, 1);
      return [...prevState];
    });
  };

  return (
    <div className={`p-3 border rounded`}>
      <section className="container px-0 mx-0">
        {props.writeChapter && (
          <div {...getRootProps({ style })}>
            <input {...getInputProps()} />
            <p className="mt-2">
              {files.length && props.singleFile
                ? objectPath.get(documentDate, props.path)
                    .file
                : `Drag 'n' drop ${
                    props.singleFile ? "file" : "files"
                  }, or click to upload.`}
            </p>
          </div>
        )}
        {files.length && !props.singleFile ? (
          <aside>
            {props.writeChapter && (
              <>
                <label className={`${props.writeChapter ? `mt-3` : ``}`}>
                  Uploaded{" "}
                  {props.singleFile || files.length === 1 ? "file" : "files"}
                </label>
                <hr className="w-100 m-0" />
              </>
            )}
            <ul className="mb-0">
              {files.map((file, index) => (
                <FileDescription
                  key={index}
                  {...props}
                  deleteHandler={deleteHandler}
                  index={index}
                  onChange={onChange}
                  file={file}
                />
              ))}
            </ul>
          </aside>
        ) : (
          !props.writeChapter && (
            <div className="text-secondary">
              <FontAwesomeIcon icon="file-times" className="mr-2" />
              <div className="d-inline">No files uploaded.</div>
            </div>
          )
        )}
      </section>
    </div>
  );
};