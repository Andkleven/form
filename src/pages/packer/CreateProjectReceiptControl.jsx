import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import query from "graphql/query";
import Form from "components/form/Form";
import Paper from "components/layout/Paper";
import { objectifyQuery } from "functions/general";
import Canvas from "components/layout/Canvas";
import { useParams } from "react-router-dom";
import Loading from "components/Loading";
import createProjectReceiptControl from "templates/packer/createProjectReceiptControl.json"
import objectPath from "object-path";

export default () => {
    const { id } = useParams();
    const [_id, set_id] = useState(Number(id));
    const [reRender, setReRender] = useState(false);
    const [fixedData, setFixedData] = useState(null);
    const { loading, error, data } = useQuery(query[createProjectReceiptControl.query], {
        variables: { id: _id }
    });
    useEffect(() => {
        setFixedData(objectifyQuery(data));
        if (data && objectPath.get("projects.0.id", data)) {
            set_id(data.projects[0].id);
        }
    }, [
        reRender,
        loading,
        error,
        data
    ]);

    if (loading) return <Loading />;
    if (error) return <p>Error :(</p>;
    return (
        <Canvas showForm={data}>
            <Paper full>
                <Form
                    componentsId={"leadEngineersPage"}
                    document={createProjectReceiptControl}
                    reRender={() => setReRender(!reRender)}
                    data={fixedData}
                    getQueryBy={_id}
                    addValuesToData={{ "projects.0.productionLine": "packer" }}
                />
            </Paper>
        </Canvas>
    );
};