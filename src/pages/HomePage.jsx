import React from "react";
import Explorer from "explorer/Explorer";
import Canvas from "layout/Canvas";
import Paper from "layout/Paper";

export default () => {
  return (
    <Canvas>
      <Paper dark full>
        <Explorer />
      </Paper>
    </Canvas>
  );
};
