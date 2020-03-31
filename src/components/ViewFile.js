import React from "react";
import PaperStack from "components/PaperStack";
import Paper from "components/Paper";
import FetchData from "components/FetchData";

export default pageInfo => {
  const { path } = pageInfo.match.params;
  const [
    {
      response: { url },
      loading,
      error
    },
    getImage
  ] = FetchData("https://versjon2.herokuapp.com/file");

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
            <button onClick={() => getImage("/" + path)}>fetch again</button>
          </>
        )}
      </Paper>
    </PaperStack>
  );
};
