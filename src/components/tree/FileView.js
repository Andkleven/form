import React from "react";
import Paper from "components/Paper";
import PaperStack from "components/PaperStack";
import Filter from "components/tree/Filter";
import BounceLoader from "react-spinners/BounceLoader";
import { useQuery } from "@apollo/react-hooks";
import query from "request/leadEngineer/Query";
import { objectifyQuery } from "components/Functions";

export default props => {
  const { loading, error, data } = useQuery(query["OPERATOR_PROJECTS"]);
  const objectifiedData = objectifyQuery(data);

  const Content = () => {
    if (loading) {
      return (
        <div className="text-center">
          <p>Loading...</p>
          <div className="d-flex justify-content-center w-100">
            <BounceLoader color="#dddddd" size="2em" />
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
                <>
                  <div className="mb-2">
                    Sadly, no error message was recieved from the server, so we
                    don't know why.
                  </div>
                  <div className="mb-0">
                    The server might be unavailable or this computer may be
                    disconnected from the internet.
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <Filter
            data={objectifiedData}
            view={props.view}
            defaultFilters={props.defaultFilters}
            defaultSearch={props.defaultSearch}
          />
        </>
      );
    }
  };

  return (
    <>
      <PaperStack>
        <Paper darkMode fullPage={!props.children && true}>
          <Content />
        </Paper>
        {props.children}
      </PaperStack>
    </>
  );
};
