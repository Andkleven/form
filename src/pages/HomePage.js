import React from "react";
import Search from "components/search/Search.js";
import Canvas from "components/layout/Canvas";
import Paper from "components/layout/Paper";

export default () => {
  return (
    <Canvas>
      <Paper dark full>
        <Search />
      </Paper>
    </Canvas>
  );
};
