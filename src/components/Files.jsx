import React, { useEffect } from "react";
import FetchData from "functions/fetchData";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DepthButtonGroup from "components/button/DepthButtonGroup";
import DepthButton from "components/button/DepthButton";
import { useParams } from "react-router-dom";
import { useQuery } from "react-apollo";
import gql from "graphql-tag";
import ClipLoader from "react-spinners/ClipLoader";
import Dots from "components/design/Dots";
import Line from "components/design/Line";

// http://localhost:3000/file/dummy.png

const queries = {
  description: gql`
    query($id: Int) {
      descriptions(id: $id) {
        id
        uploadFiles {
          file
          fileDescription
        }
      }
    }
  `,
  item: gql`
    query($id: Int) {
      items(id: $id) {
        id
        operators {
          uploadFiles {
            file
            fileDescription
          }
        }
        finalInspectionQualityControls {
          uploadFiles {
            file
            fileDescription
          }
        }
      }
    }
  `
};

export default ({ show, setShow, children }) => {
  const handleClose = () => setShow(false);

  const params = useParams();

  // const projectQuery = useQuery(queries.project, {
  //   variables: {
  //     id: params.projectId
  //   }
  // });
  const { data: descriptionData } = useQuery(queries.description, {
    variables: {
      id: params.descriptionId
    }
  });
  const { data: itemData } = useQuery(queries.item, {
    variables: {
      id: params.itemId
    }
  });

  const leFiles =
    descriptionData &&
    descriptionData.descriptions &&
    descriptionData.descriptions[0] &&
    descriptionData.descriptions[0].uploadFiles;
  const opFiles =
    itemData &&
    itemData.items &&
    itemData.items[0] &&
    itemData.items[0].operators &&
    itemData.items[0].operators[0] &&
    itemData.items[0].operators[0].uploadFiles;
  const qcFiles =
    itemData &&
    itemData.items &&
    itemData.items[0] &&
    itemData.items[0].finalInspectionQualityControls &&
    itemData.items[0].finalInspectionQualityControls[0] &&
    itemData.items[0].finalInspectionQualityControls[0].uploadFiles;
  const fileGroups = [
    { label: "Lead Engineer", files: leFiles },
    { label: "Operator", files: opFiles },
    { label: "Quality Control", files: qcFiles }
  ];

  return (
    <>
      {children}
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header>
          <Modal.Title className="d-flex justify-content-between w-100">
            <div>
              <FontAwesomeIcon
                icon={["fas", "copy"]}
                className="text-primary"
              />{" "}
              Files
            </div>
            <div>
              <DepthButtonGroup>
                <DepthButton onClick={handleClose} className="h-100">
                  <FontAwesomeIcon icon={["fal", "times"]} />
                </DepthButton>
              </DepthButtonGroup>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {fileGroups &&
            fileGroups.map((fileGroup, fileGroupIndex) => {
              return (
                fileGroup.files &&
                fileGroup.files.length > 0 && (
                  <div className="mb-4">
                    <h3>{fileGroup.label}</h3>
                    <Line />
                    {fileGroup.files.map((file, fileIndex) => (
                      <File
                        file={file}
                        className={
                          // fileIndex === 0 && fileGroupIndex === 0
                          //   ? ""
                          //   : "mt-3"
                          "mt-3"
                        }
                      />
                    ))}
                  </div>
                )
              );
            })}
        </Modal.Body>
        <Modal.Footer>
          <DepthButtonGroup className="w-100">
            <DepthButton onClick={handleClose}>Close</DepthButton>
          </DepthButtonGroup>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const File = ({ file, ...props }) => {
  const filename = file.file.replace("document/", "");
  const description = file.fileDescription;
  const extension = filename.substr(filename.lastIndexOf(".") + 1);

  console.log(file);
  console.log("filename:", filename);
  console.log("description:", description);
  console.log("extension:", extension);

  const imageExtensions = ["png", "jpg", "webp", "jpeg", "gif", "tif"];
  const isImage = extension =>
    imageExtensions.includes(extension.toLowerCase());
  // const isPdf = extension => extension.toLowerCase() === "pdf";

  const [
    {
      response: { url },
      loading,
      error
    },
    getImage
  ] = FetchData(`${process.env.REACT_APP_BACKEND}/file/`);

  useEffect(() => {
    getImage(filename);
    // TODO: Correctly implement useEffect
    // See https://github.com/facebook/create-react-app/issues/6880
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {error && <p style={{ color: "red" }}>something went wrong try again!</p>}
      {loading ? (
        <div {...props}>
          <div className="d-flex justify-content-start align-items-center">
            <ClipLoader color="rgba(0, 0, 0, 0.5)" size={15} />
            <div className="ml-3">
              Getting file
              <Dots />
            </div>
          </div>
        </div>
      ) : (
        <div {...props}>
          {isImage(extension) ? (
            <img src={url} alt="test" className="w-100 rounded shadow" />
          ) : (
            <div>
              {filename}{" "}
              <span className="text-muted">(No preview available)</span>
            </div>
          )}
          <div>{description}</div>
        </div>
      )}
    </>
  );
};
