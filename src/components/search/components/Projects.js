import React, { useContext } from "react";
import { ProjectContext } from "./ProjectContext";
import ProjectLink from "./ProjectLink";

export default ({ data, iconSize }) => {
  const [projectId, setProjectId] = useContext(ProjectContext);
  return (
    <>
      <h6 className="mb-0">Projects</h6>
      <ProjectLink
        onClick={() => setProjectId(0)}
        icon="folder-plus"
        iconSize={iconSize}
      >
        Create new project
      </ProjectLink>
      {data && data.length > 0 ? (
        data.map((project, indexProject) => (
          <ProjectLink
            onClick={() => setProjectId(project.id)}
            key={`project${indexProject}`}
            iconSize={iconSize}
          >
            {project.data.projectName}
          </ProjectLink>
        ))
      ) : (
        <div className="pt-1 text-secondary">
          <em>No projects found.</em>
        </div>
      )}
    </>
  );
};
