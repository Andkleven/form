import React from "react";
import PaperStack from "../layout/PaperStack";
import Paper from "../layout/Paper";
import FetchData from "../functions/fetchData";
import { useParams } from "react-router-dom";

// http://localhost:3000/file/dummy.png

export default () => {
  const { filename } = useParams();
  const [
    {
      response: { url },
      loading,
      error
    },
    getImage
  ] = FetchData(`${process.env.REACT_APP_BACKEND}/file/`);

  return (
    <PaperStack>
      <Paper>
        {error && (
          <p style={{ color: "red" }}>something went wrong try again!</p>
        )}
        {loading ? (
          "loading ..."
        ) : (
          <>
            <img src={url} alt="test" />
            <button onClick={() => getImage(filename)}>fetch again</button>
          </>
        )}
      </Paper>
    </PaperStack>
  );
};
