import React from "react";
import Search from "components/search/Search";
import Canvas from "components/layout/Canvas";
import PaperStack from "components/layout/PaperStack";
import Paper from "components/layout/Paper";

export default () => {
  return (
    <Canvas>
      <Paper dark full>
        <Search
        // view="projects"
        />
      </Paper>
    </Canvas>
  );
};
