import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UpdateProject from "pages/UpdateProject"
import { useMutation } from "react-apollo";
import createProjectJson from "templates/createProject.json";
import gql from "graphql-tag";


export default () => {
    const { productionLine } = useParams();
    const [state, setState] = useState(0)
    const SET_PRODUCTION_LINE = gql`
    mutation projects($projects: [ProjectInput]) {
        projects(projects: $projects) {
        new {
            id
        }
        }
    }
    `;
    const [setProductionLine, { data }] = useMutation(SET_PRODUCTION_LINE);

    useEffect(() => {
        if (state === 0) {
            setProductionLine({
                variables: { projects: [{ productionLine }] }
            });
        }
    }, [setProductionLine, productionLine, state])

    useEffect(() => {
        if (state === 0 && data && data.projects.new.id) {
            setState(data.projects.new.id)
        }
    }, [data, setState, state])
    if (state) {
        return < UpdateProject _id={state} createProjectJson={createProjectJson} />
    } else {
        return null
    }
}