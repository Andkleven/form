import React, { useState, createContext } from "react";

export const ProjectContext = createContext();

export const ProjectProvider = props => {
  const [project, setProject] = useState();
  return (
    <ProjectContext.Provider value={[project, setProject]}>
      {props.children}
    </ProjectContext.Provider>
  );
};
