import React, { useState, createContext } from "react";

export const ProjectContext = createContext();

export const ProjectProvider = props => {
  const [projectId, setProjectId] = useState();
  return (
    <ProjectContext.Provider value={[projectId, setProjectId]}>
      {props.children}
    </ProjectContext.Provider>
  );
};
