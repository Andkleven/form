import React, { useEffect, useState, useRef } from "react";
import FetchData from "functions/fetchData";
import { Modal, Row, Button, Col, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DepthButtonGroup from "components/button/DepthButtonGroup";
import DepthButton from "components/button/DepthButton";
import { useParams } from "react-router-dom";
import { useQuery } from "react-apollo";
import gql from "graphql-tag";
import Line from "components/design/Line";
import { useSpring, animated, config } from "react-spring";
import Div100vh from "react-div-100vh";

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
          id
          data
          measurementPointQualityControls {
            id
            data
          }
          hardnessQualityControls {
            id
            data
          }
          peelTestQualityControls {
            id
            data
          }
          finalInspectionCustomTestQualityControls {
            id
            data
          }
          finalInspectionDimensionsCheckQualityControls {
            id
            data
          }
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
                  <div
                    className="mb-4"
                    key={`generalView-fileGroup-${fileGroupIndex}`}
                  >
                    <h5>{fileGroup.label}</h5>
                    <Line />
                    <Row>
                      {fileGroup.files.map((file, fileIndex) => (
                        <Col xs={6} sm={4} md={3} lg={2}>
                          <File
                            key={`generalView-file-${fileIndex}`}
                            file={file}
                          />
                        </Col>
                      ))}
                    </Row>
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
  const filenameShort = filename.replace(`.${extension}`, "");

  // console.log(file);
  // console.log("filename:", filename);
  // console.log("description:", description);
  // console.log("extension:", extension);

  const imageExtensions = ["png", "jpg", "webp", "jpeg", "gif", "tif"];
  const isImage = imageExtensions.includes(extension.toLowerCase());
  const isPdf = extension.toLowerCase() === "pdf";

  const [show, setShow] = useState(false);

  // Fetching
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

  // Thumbnail
  const upScale = 1.15;
  const downScale = 0.95;
  const onText = 1;
  const offText = 0.75;

  const springConfig = { ...config.stiff, mass: 0.5 };

  const [emblemSpring, setEmblem] = useSpring(() => ({
    scale: 1,
    opacity: 1,
    from: { opacity: 0 },
    config: springConfig
  }));

  const [textSpring, setText] = useSpring(() => ({
    opacity: offText,
    from: { opacity: 0 },
    config: springConfig
  }));

  const Thumbnail = () => {
    return (
      <>
        <div className="w-100 d-flex justify-content-center m-0 p-0">
          <Button
            // Functionality
            disabled={!url || error}
            onClick={() => {
              if (isImage) {
                setShow(true);
              } else if (isPdf) {
                window.open(url, "_blank");
              }
              setEmblem({ scale: 1 });
              setText({ opacity: offText });
            }}
            // Style
            variant=""
            className="text-center my-1 mx-0 w-100 py-1 px-0"
            // Animations
            onMouseEnter={() => {
              setEmblem({ scale: upScale });
              setText({ opacity: onText });
            }}
            onMouseLeave={() => {
              setEmblem({ scale: 1 });
              setText({ opacity: offText });
            }}
            onMouseDown={() => {
              setEmblem({ scale: downScale });
            }}
            onMouseUp={() => {
              setEmblem({ scale: upScale });
            }}
            onTouchStart={() => {
              setEmblem({ scale: downScale });
              setText({ opacity: onText });
            }}
            onTouchEnd={() => {
              setEmblem({ scale: 1 });
              setText({ opacity: offText });
            }}
          >
            {/* <div className="w-100 d-flex align-items-center"> */}
            <animated.div style={emblemSpring}>
              {isImage && (
                <FontAwesomeIcon
                  className="text-info my-3"
                  size="2x"
                  icon={["fad", "file-image"]}
                />
              )}
              {isPdf && (
                <FontAwesomeIcon
                  className="text-primary my-3"
                  size="2x"
                  icon={["fad", "file-alt"]}
                />
              )}
            </animated.div>
            {/* </div> */}
            <animated.div style={{ overflowWrap: "break-word", ...textSpring }}>
              {filenameShort}
            </animated.div>
          </Button>
        </div>
      </>
    );
  };

  const descriptionRef = useRef(null);
  const [overflow, setOverflow] = useState(false);

  // eslint-disable-next-line
  useEffect(() => {
    console.log("Ref:", descriptionRef.current);
    setOverflow(
      descriptionRef.current &&
        (descriptionRef.current.offsetHeight <
          descriptionRef.current.scrollHeight ||
          descriptionRef.current.offsetWidth <
            descriptionRef.current.scrollWidth)
    );
  });

  const Content = () => {
    return (
      <>
        <Div100vh
          style={{
            position: "fixed",
            width: "100%",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            zIndex: 999,
            backgroundColor: "rgba(0, 0, 0, 0.25)"
          }}
          className=""
        >
          <div
            style={{
              position: "fixed",
              // top: 0,
              // right: 0,
              // left: 0,
              // zIndex: 1000,
              height: 0
            }}
            className="p-3 w-100 d-flex justify-content-end"
          >
            <Button
              variant=""
              onClick={() => {
                setShow(false);
              }}
              className="text-white"
            >
              <FontAwesomeIcon icon={["fas", "times"]} size="2x" />
            </Button>
          </div>
          <Container className="d-flex flex-column justify-content-between align-items-center h-100 w-100">
            <div className="mt-5 mb-3 h-100 w-100 d-flex justify-content-center align-items-center">
              <img
                className="rounded shadow"
                style={{
                  objectFit: "contain",
                  maxWidth: "100%",
                  maxHeight: "100%"
                }}
                // src="https://upload.wikimedia.org/wikipedia/commons/c/cc/ESC_large_ISS022_ISS022-E-11387-edit_01.JPG"
                src="https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492_960_720.jpg"
                // src="https://cdn.pixabay.com/photo/2017/08/23/15/39/square-2673252_960_720.png"
                alt="Placeholder"
              />
            </div>
            <div
              ref={descriptionRef}
              className="my-3 text-white"
              style={{
                textShadow: "0px 0px 6px rgba(0, 0, 0, 0.25)",
                maxHeight: "25vh",
                overflow: "scroll"
              }}
            >
              {overflow && "OVERFLOW"}
              {description}
            </div>
          </Container>
        </Div100vh>

        {/* {error && (
          <p style={{ color: "red" }}>something went wrong try again!</p>
        )}
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
            {isImage ? (
              <img src={url} alt="test" className="w-100 rounded shadow" />
            ) : isPdf ? (
              <a href={url} target="_blank">
                {filename}
              </a>
            ) : (
              <div>
                {filename}{" "}
                <span className="text-muted">(No preview available)</span>
              </div>
            )}
            <div>{description}</div>
          </div>
        )} */}
      </>
    );
  };

  return (
    <>
      <Thumbnail />
      {show && <Content />}
    </>
  );
};
