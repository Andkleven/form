import React, { useContext } from "react";
import ProjectPage from "pages/leadEngineer/ItemPage";
import Search from "components/search/Search.js";
import {
  ProjectContext,
  ProjectProvider
} from "components/search/components/ProjectContext";

const Content = () => {
  const [projectId] = useContext(ProjectContext);
  return (
    <Search view="projects">
      {(typeof projectId === "string" || typeof projectId === "number") && (
        <>
          <div className="mt-n1 mt-sm-1" />
          <ProjectPage id={projectId} />
        </>
      )}
    </Search>
  );
};

export default () => {
  return (
    <ProjectProvider>
      <Content />
    </ProjectProvider>
  );
};
