import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import CreateProject from "pages/CreateProject"
import { useMutation } from "react-apollo";
import createProjectJson from "templates/createProject.json";
import gql from "graphql-tag";


export default () => {
    console.log(2134)
    const { id, productionLine } = useParams();
    const SET_PRODUCTION_LINE = gql`
    mutation projects(projects: [ProjectInput]) {
        projects(project: $project) {
        new {
            id
        }
        }
    }
    `;
    const [setProductionLine, { data }] = useMutation(SET_PRODUCTION_LINE);

    useEffect(() => {
        console.log(id)
        if (Number(id) === 0) {
            setProductionLine({
                variables: [{ productionLine }]
            });
        }
    }, [setProductionLine, id, productionLine])

    useEffect(() => {
        console.log(data)
        if (Number(id) === 0 && data && data.new.id) {
            useHistory().push(`/project/${productionLine}/${data.new.id}`);
        }
    }, [data, productionLine, id])

    if (id) {
        return < CreateProject id={id} createProjectJson={createProjectJson} />
    } else {
        return null
    }
}