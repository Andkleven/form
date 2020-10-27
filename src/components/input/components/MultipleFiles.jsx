import React, {
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback
} from "react";
import { useDropzone } from "react-dropzone";
import FileDescription from "../widgets/FileDescription";
import objectPath from "object-path";
import { DocumentDataContext, ChapterContext } from "components/form/Form";
import { writeChapter } from "functions/general";
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
    id: props.label,
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
  const { finalChapter, editChapter } = useContext(ChapterContext);

  const { documentDataDispatch, resetState } = useContext(DocumentDataContext);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    setFiles([]);
  }, [props.componentsId, setFiles]);

  const setBackendFiles = useCallback(() => {
    let oldFiles = objectPath.get(props.backendData, props.path);
    if (oldFiles) {
      oldFiles = oldFiles.map(oldFile => ({
        ...oldFile,
        file: {
          name: oldFile.file.name || oldFile.file.split("/")[1]
        }
      }));
      setFiles(oldFiles);
    }
  }, [props.path, props.backendData]);

  useEffect(() => {
    resetState.current[
      `${props.path}-${props.label}-${props.repeatStepList}-MultipleFiles`
    ] = setBackendFiles;
    return () => {
      if (
        resetState.current[
          `${props.path}-${props.label}-${props.repeatStepList}-MultipleFiles`
        ]
      ) {
        // eslint-disable-next-line
        delete resetState.current[
          `${props.path}-${props.label}-${props.repeatStepList}-MultipleFiles`
        ];
      }
    };
  }, [
    setBackendFiles,
    props.repeatStepList,
    props.path,
    props.label,
    resetState
  ]);

  useEffect(() => {
    setBackendFiles();
  }, [setBackendFiles]);

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
  console.log(props.label);
  return (
    <div className={`p-3 border rounded`}>
      <section className="container px-0 mx-0">
        {writeChapter(
          props.allWaysShow,
          editChapter,
          props.thisChapter,
          finalChapter.current
        ) && (
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
              // {...getInputProps()}
              id={`${props.label}`}
              name={props.label || props.prepend}
              type="file"
              style={{}}
              hidden
            />
          </div>
        )}
        {files.length ? (
          <aside>
            {writeChapter(
              props.allWaysShow,
              editChapter,
              props.thisChapter,
              finalChapter.current
            ) && (
              <>
                <label
                  className={`${
                    writeChapter(
                      props.allWaysShow,
                      editChapter,
                      props.thisChapter,
                      finalChapter.current
                    )
                      ? `mt-3`
                      : ``
                  }`}
                >
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
          !writeChapter(
            props.allWaysShow,
            editChapter,
            props.thisChapter,
            finalChapter.current
          ) && (
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
