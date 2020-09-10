export const indexProject = (data, projectName) => {
  const index = data["projects"].findIndex(
    element => element["data"]["projectName"] === projectName
  );
  return index;
};

export const indexDescription = (
  data,
  projectName,
  descriptionName = false
) => {
  const projectIndex = indexProject(data, projectName);
  const index = data["projects"][projectIndex]["descriptions"].findIndex(
    element => element["data"]["descriptionNameMaterialNo"] === descriptionName
  );
  return index;
};

export function numberOfChildren(data, projectName, descriptionName) {
  const projectIndex = indexProject(data, projectName);
  const project = data["projects"][projectIndex];

  const projectIsNonEmpty =
    !!project &&
    !!project["descriptions"] &&
    project["descriptions"].length > 0;

  if (projectIsNonEmpty && !!descriptionName) {
    const descriptionsExist =
      !!project["descriptions"] && project["descriptions"].length > 0;

    if (descriptionsExist) {
      const descriptionIndex = indexDescription(
        data,
        projectName,
        descriptionName
      );
      const description = project["descriptions"][descriptionIndex];

      const descriptionIsNonEmpty =
        !!description &&
        !!description["items"] &&
        description["items"].length > 0;

      if (descriptionIsNonEmpty) {
        return description["items"].length;
      }
    }
  } else if (projectIsNonEmpty) {
    return project["descriptions"].length;
  } else {
    return 0;
  }
}
