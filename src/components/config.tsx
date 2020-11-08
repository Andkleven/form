import React, { createContext } from "react";

interface Props {
  children: React.ReactNode;
  mutations: string;
  query: string;
  user: string;
  mathCollection: string;
  stages: string;
}

export const ConfigContext = createContext<any>({});

export default ({
  children,
  mutations,
  query,
  user,
  mathCollection,
  stages
}: Props): any => {
  return (
    <ConfigContext.Provider
      value={{ mutations, query, user, mathCollection, stages }}
    >
      {children}
    </ConfigContext.Provider>
  );
};
