import React, { useContext } from "react";
import { ProjectContext } from "./ProjectContext";
import ProjectLink from "./ProjectLink";

export default ({
  data,
  iconSize,
  iconStyle,
  headline = "Projects",
  ...props
}) => {
  const [projectId, setProjectId] = useContext(ProjectContext);
  return (
    <div className={props.className}>
      {headline && <h6 className="mb-0">{headline}</h6>}
      <ProjectLink
        onClick={() => setProjectId(0)}
        icon={["fad", "file-plus"]}
        iconSize={iconSize}
        iconStyle={iconStyle}
      >
        Create new project
      </ProjectLink>
      {data && data.length > 0 ? (
        data.map((project, indexProject) => (
          <ProjectLink
            onClick={() => setProjectId(project.id)}
            key={`project${indexProject}`}
            icon={["fas", "file-invoice"]}
            iconSize={iconSize}
            iconStyle={iconStyle}
          >
            {project.data.projectName}
          </ProjectLink>
        ))
      ) : (
        <div className="pt-1 text-secondary">
          <em>No projects found.</em>
        </div>
      )}
    </div>
  );
};
