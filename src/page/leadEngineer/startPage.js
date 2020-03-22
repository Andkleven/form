import React from "react";
import ProjectPage from "page/ItemPage";

import FileView from "components/tree/FileView";

export default () => {
  const id = 0;
  return (
    <FileView view="projects">
      <div className="mt-n1" />
      <ProjectPage id={id} />
    </FileView>
  );
};
