import React from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "../request/leadEngineer/Query";
import Paper from "components/Paper";
import ProjectTree from "components/tree/ProjectTree";
import { expandJson } from "components/Functions";
import BounceLoader from "react-spinners/BounceLoader";
// import "components/stage";

export default () => {
  const { loading, error, data } = useQuery(query["OPERATOR_PROJECTS"], {
    variables: { leadEngineerDone: true, operatorDone: false }
  });

  let json;
  if (data) {
    json = expandJson(data);
  }

  const Content = () => {
    if (loading) {
      return (
        <div className="text-center">
          <p>Loading...</p>
          <div className="d-flex justify-content-center w-100">
            <BounceLoader color={`#dddddd`} size="2em" />
          </div>
        </div>
      );
    } else if (error) {
      return (
        <>
          <div className="d-flex justify-content-center w-100">
            <div
              className="text-center border rounded p-3 bg-danger"
              style={{ maxWidth: 400 }}
            >
              <i className="fad fa-exclamation-triangle fa-3x mb-3" />
              <h6>Something went wrong!</h6>
              {typeof error === "string" ? (
                <>
                  <div className="text-center">
                    Error message from the sever:
                  </div>
                  <div className="text-center">{error}</div>
                </>
              ) : (
                <div className="text-center">
                  Sadly, no error message was recieved from the server, so we
                  don't know why.
                </div>
              )}
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <ProjectTree data={json} />
        </>
      );
    }
  };

  return (
    <Paper darkMode>
      <Content />
    </Paper>
  );
};
