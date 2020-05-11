import React, { useContext } from "react";
import ProjectPage from "pages/leadEngineer/ItemPage";
import Explorer from "components/search/Explorer";
import {
  ProjectContext,
  ProjectProvider
} from "components/search/components/ProjectContext";

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
