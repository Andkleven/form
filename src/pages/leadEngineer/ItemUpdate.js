import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import query from "graphql/query";
import objectPath from "object-path";
import itemsJson from "templates/createProject.json";
import mutations from "graphql/mutation";
import Input from "components/input/Input";
import SubmitButton from "components/button/SubmitButton";
import CancelButton from "components/button/CancelButton";
import GeneralButton from "components/button/GeneralButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DepthButton from "components/button/DepthButton";

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

  if (props.edit) {
    return (
      <>
        <Input
          onChange={e => setState(e.target.value)}
          value={state}
          label="Item ID"
        />
        <div className="d-flex w-100">
          <SubmitButton onClick={handleSubmit}>Rename</SubmitButton>
          <div className="px-1"></div>
          <CancelButton onClick={props.onCancel} />
        </div>
      </>
    );
  }

  return (
    <>
      <div>
        <Input
          tight
          onChange={e => setState(e.target.value)}
          value={state}
          label="Item ID"
          append={
            <DepthButton onClick={handleSubmit}>
              <FontAwesomeIcon
                icon={["fal", "plus"]}
                size="xs"
                className="mr-2"
              />
              <FontAwesomeIcon
                icon={["fas", "cube"]}
                size="md"
                className="mr-sm-2 text-secondary"
              />
              <div className="d-none d-sm-inline">Add item to project</div>
            </DepthButton>
          }
        />
      </div>
    </>
  );
};
