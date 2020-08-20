import React, { useMemo, useState, useEffect, useContext, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import FileDescription from "../widgets/FileDescription";
import objectPath from "object-path";
import { documentDataContext, ChapterContext } from "components/form/Form";
import { writeOrReadChapter } from "functions/general";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const cloneDeep = require("clone-deep");

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

export default ({ ...props }) => {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    isFocused
  } = useDropzone({
    accept: "image/*,application/pdf",
    onDrop: acceptedFiles => {
      setFiles(prevState => {
        acceptedFiles.forEach(file => {
          prevState.push({ file: file });
        });
        return [...prevState];
      });
    }
  });
  const {
    finalChapter,
    editChapter
  } = useContext(ChapterContext);

  const { documentDataDispatch, resetState } = useContext(documentDataContext);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    setFiles([]);

  }, [props.componentsId, setFiles]);

  const setBackendFiles = useCallback(
    () => {
      let oldFiles = objectPath.get(props.backendData, props.path);
      if (oldFiles) {
        oldFiles = oldFiles.map(oldFile => ({
          ...oldFile,
          file: {
            name: oldFile.file.name || oldFile.file.split("/")[1]
          }
        }));
        setFiles(oldFiles);
        objectPath.set(props.backendData, props.path, cloneDeep(oldFiles));
      }
    },
    [props.path, props.backendData],
  )

  useEffect(() => {
    setBackendFiles()
    let resetStateRef = resetState.current
    resetStateRef[`${props.path}-${props.label}-${props.repeatStepList}-MultipleFiles`] = setBackendFiles;
    return () => {
      delete resetStateRef[`${props.path}-${props.label}-${props.repeatStepList}-MultipleFiles`];
    }
  }, [setBackendFiles, props.repeatStepList, props.path, props.label, resetState]);

  useEffect(() => {
    documentDataDispatch({ type: "add", path: props.path, newState: files });

  }, [files, props.path, documentDataDispatch]);

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
      ...(isFocused ? focusedStyle : {})
    }),
    [isDragActive, isDragReject, isDragAccept, isFocused]
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
        {writeOrReadChapter(props.allWaysShow, editChapter, props.thisChapter, finalChapter) && (
          <div {...getRootProps({ style })}>
            <div
              // htmlFor={props.label || props.prepend}
              className="w-100 text-center"
              style={{
                wordBreak: "break-word"
              }}
            >
              Drag and drop files, or click to upload
            </div>
            <input
              {...getInputProps()}
              id={props.label || props.prepend}
              name={props.label || props.prepend}
              type="file"
              style={{}}
              hidden
            />
          </div>
        )}
        {files.length ? (
          <aside>
            {writeOrReadChapter(props.allWaysShow, editChapter, props.thisChapter, finalChapter) && (
              <>
                <label className={`${writeOrReadChapter(props.allWaysShow, editChapter, props.thisChapter, finalChapter) ? `mt-3` : ``}`}>
                  Uploaded files
                </label>
                <hr className="w-100 m-0" />
              </>
            )}
            <ul className="px-0 mb-0">
              {files.map((file, index) => (
                <FileDescription
                  key={`${index}-FileDescription`}
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
            !writeOrReadChapter(props.allWaysShow, editChapter, props.thisChapter, finalChapter) && (
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
