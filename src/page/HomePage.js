import React, { useCallback, useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { useDropzone } from "react-dropzone";

const uploadFileMutation = gql`
  mutation UploadFile($files: Upload) {
    uploadFile(files: $files) {
      new {
        category {
          id
          uploadfile {
            id
            file
          }
        }
      }
    }
  }
`;

function Home() {
  const [files, setFiles] = useState([]);
  const [mutation, { loadingMutation, error: errorMutation }] = useMutation(
    uploadFileMutation
  );
  const onDrop = useCallback(acceptedFiles => {
    setFiles(prevState => [...prevState, ...acceptedFiles]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const showFiles = files.map(file => <li key={file.name}>{file.name}</li>);
  return (
    <>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag and drop some files here, or click to select files</p>
        )}
      </div>
      <button
        onClick={() => {
          mutation({
            variables: { files: files ? files : null }
          });
          setFiles([]);
        }}
      >
        POST
      </button>

      {showFiles}
    </>
  );
}
export default Home;
