import React from "react";
import Search from "components/search/Search";
import Canvas from "components/layout/Canvas";
import Paper from "components/layout/Paper";

export default () => {
  return (
    <Canvas>
      <Paper dark full>
        <Search view="items" />
        {/* <Search view="projects" /> */}
      </Paper>
    </Canvas>
  );
};
