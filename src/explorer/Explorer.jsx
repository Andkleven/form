import React, { useEffect } from "react";
import ExplorerView from "explorer/components/ExplorerView";
import { useQuery } from "@apollo/react-hooks";
import query from "graphql/query";
import { objectifyQuery } from "functions/general";
import LoadingAnimation from "./components/LoadingAnimation";
import ErrorMessage from "components/design/ErrorMessage";
import { getAccess } from "functions/user.ts";

export default ({
  defaultFilters,
  defaultSearch,
  // animated = true,
  iconSize = "lg",
  iconStyle = {
    position: "relative",
    bottom: "0.025em",
    right: "0.25em",
    width: "1.5em",
    textAlign: "center"
  },
  rowStyle = {
    minHeight: "2.5em"
  },
  ...props
}) => {
  let { loading, error, data, refetch } = useQuery(query["OPERATOR_PROJECTS"], {
    variables: { orderByLatestProject: true }
  });

  useEffect(() => {
    if (data && !loading && !error) {
      refetch();
    }
  }, [refetch, data, loading, error]);

  data = objectifyQuery(data);

  if (loading) {
    return LoadingAnimation;
  } else if (error) {
    return <ErrorMessage big error={error} />;
  } else {
    return (
      <ExplorerView
        {...props}
        iconSize={iconSize}
        iconStyle={iconStyle}
        rowStyle={rowStyle}
        data={data}
        access={getAccess()}
      />
    );
  }
};
