import React from "react";
import { useParams } from "react-router-dom";
import CreateProject from "components/pages/CreateProject"
import createProjectJson from "templates/createProject.json";


export default () => {
    const params = useParams();
    return < CreateProject id={params.id} createProjectJson={createProjectJson} />
}