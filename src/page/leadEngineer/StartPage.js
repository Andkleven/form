import React, { useContext } from "react";
import ProjectPage from "page/ItemPage";
import FileView from "components/tree/FileView";
import {
  ProjectContext,
  ProjectProvider
} from "components/tree/ProjectContext";

const Content = () => {
  const [projectId] = useContext(ProjectContext);
  return (
    <FileView view="projects">
      {(typeof projectId === "string" || typeof projectId === "number") && (
        <>
          <div className="mt-n1 mt-sm-1" />
          <ProjectPage id={projectId} />
        </>
      )}
    </FileView>
  );
};

export default () => {
  return (
    <ProjectProvider>
      <Content />
    </ProjectProvider>
  );
};
