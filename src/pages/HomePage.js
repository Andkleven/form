import React from "react";
import Explorer from "components/search/Explorer";
import Canvas from "components/layout/Canvas";
import Paper from "components/layout/Paper";

export default () => {
  return (
    <Canvas>
      <Paper dark full>
        <Explorer />
      </Paper>
    </Canvas>
  );
};
