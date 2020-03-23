import React, { useContext } from "react";
import ProjectPage from "page/ItemPage";
import FileView from "components/tree/FileView";
import {
  ProjectContext,
  ProjectProvider
} from "components/tree/ProjectContext";

const Content = () => {
  const [project] = useContext(ProjectContext);
  return (
    <FileView view="projects">
      {(typeof project === "string" || typeof project === "number") && (
        <>
          {console.log(project)}
          <div className="mt-n1 mt-sm-1" />
          <ProjectPage id={project} />
        </>
      )}
    </FileView>
  );
};

export default () => (
  <ProjectProvider>
    <Content />
  </ProjectProvider>
);
