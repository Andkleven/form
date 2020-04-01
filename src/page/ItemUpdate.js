import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import query from "../request/leadEngineer/Query";
import objectPath from "object-path";
import itemsJson from "../forms/Item.json";
import mutations from "../request/leadEngineer/MutationToDatabase";
import Input from "components/Input";
import SubmitButton from "components/buttons/SubmitButton";

export default props => {
  const [state, setState] = useState(props.value ? props.value : "");
  const update = (cache, { data }) => {
    const oldData = cache.readQuery({
      query: query[itemsJson.query],
      variables: { id: props.getQueryBy }
    });
    let array = objectPath.get(oldData, props.queryPath);
    let index = array.findIndex(x => x.id === data.items.new.id);
    objectPath.set(
      oldData,
      `projects.0.descriptions.${props.counter}.items.${index}`,
      data.items.new
    );
    cache.writeQuery({
      query: query[itemsJson.query],
      variables: { id: props.getQueryBy },
      data: { ...oldData }
    });
  };
  const create = (cache, { data }) => {
    console.log("hva?");
    const oldData = cache.readQuery({
      query: query[itemsJson.query],
      variables: { id: props.getQueryBy }
    });
    console.log("hva?");
    console.log(oldData, 3);
    objectPath.push(
      oldData,
      `projects.0.descriptions.${props.counter}.items`,
      data.items.new
    );
    console.log(oldData, 1);
    cache.writeQuery({
      query: query[itemsJson.query],
      variables: { id: props.getQueryBy },
      data: { ...oldData }
    });
  };
  const [mutation, { loading, error }] = useMutation(mutations["UPDATEITEM"], {
    update: props.id ? update : create
  });

  const handelSubmit = () => {
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
        label="Item Id"
      />
      <SubmitButton onClick={handelSubmit} />
      {loading && <p>Loading...</p>}
      {error && <p>Error :( Please try again</p>}
    </>
  );
};
