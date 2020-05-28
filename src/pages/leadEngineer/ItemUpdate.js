import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import query from "graphql/query";
import objectPath from "object-path";
import itemsJson from "templates/createProject.json";
import mutations from "graphql/mutation";
import Input from "components/input/Input";
import SubmitButton from "components/button/SubmitButton";

export default props => {
  const [state, setState] = useState(props.value ? props.value : "");
  const update = (cache, { data }) => {
    const oldData = cache.readQuery({
      query: query[itemsJson.query],
      variables: { id: props.getQueryBy }
    });
    let array = objectPath.get(
      oldData,
      `projects.0.descriptions.${props.counter}.items`
    );
    let index = array.findIndex(x => x.id === data.item.new.id);
    objectPath.set(
      oldData,
      `projects.0.descriptions.${props.counter}.items.${index}`,
      data.item.new
    );
    cache.writeQuery({
      query: query[itemsJson.query],
      variables: { id: props.getQueryBy },
      data: { ...oldData }
    });
  };
  const create = (cache, { data }) => {
    const oldData = cache.readQuery({
      query: query[itemsJson.query],
      variables: { id: props.getQueryBy }
    });
    objectPath.push(
      oldData,
      `projects.0.descriptions.${props.counter}.items`,
      data.item.new
    );
    cache.writeQuery({
      query: query[itemsJson.query],
      variables: { id: props.getQueryBy },
      data: { ...oldData }
    });
  };
  const [mutation, { loading, error }] = useMutation(mutations["ITEM"], {
    update: props.id ? update : create
  });

  const handleSubmit = () => {
    mutation({
      variables: {
        id: props.id,
        itemId: state,
        foreignKey: props.foreignKey
      }
    });
    if (props.done) {
      props.done();
    }
  };

  return (
    <>
      <Input
        onChange={e => setState(e.target.value)}
        value={state}
        label="Item ID"
      />
      <SubmitButton onClick={handleSubmit}>Add item to project</SubmitButton>
      {loading && <p>Loading...</p>}
      {error && <p>Error :( Please try again</p>}
    </>
  );
};
