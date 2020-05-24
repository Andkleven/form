import React, { useContext } from "react";
import ProjectPage from "pages/leadEngineer/CreateProject";
import Explorer from "components/explorer/Explorer";
import {
  ProjectContext,
  ProjectProvider
} from "components/explorer/components/ProjectContext";

const Content = () => {
  const [projectId] = useContext(ProjectContext);
  return (
    <Explorer view="projects">
      {(typeof projectId === "string" || typeof projectId === "number") && (
        <>
          <div className="mt-n1 mt-sm-1" />
          <ProjectPage id={projectId} />
        </>
      )}
    </Explorer>
  );
};

export default () => {
  return (
    <ProjectProvider>
      <Content />
    </ProjectProvider>
  );
};
