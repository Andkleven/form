import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import query from "graphql/query";
import objectPath from "object-path";
import itemsJson from "templates/createProject.json";
import mutations from "graphql/mutation";
import Input from "components/input/Input";
import SubmitButton from "components/button/SubmitButton";
import CancelButton from "components/button/CancelButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DepthButton from "components/button/DepthButton";
import { Form } from "react-bootstrap";

export default ({ descriptionName = "description", ...props }) => {
  const [state, setState] = useState(props.value ? props.value : null);
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
  const [mutation, { error: mutationError }] = useMutation(mutations["ITEM"], {
    update: props.id ? update : create
  });

  const handleSubmit = () => {
    mutation({
      variables: {
        id: props.id,
        itemId: state,
        foreignKey: props.foreignKey
      }
    })
      .then(() => {
        if (props.onDone) {
          props.onDone();
        }
        setValid(true);
      })
      .catch(e => {
        // console.log(e);
      });
  };

  const [valid, setValid] = useState();
  const error =
    mutationError && mutationError.message.replace("GraphQL error: ", "");

  if (props.edit) {
    return (
      <Form
        onSubmit={e => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Input
          onChange={e => {
            setValid(false);
            setState(e.target.value);
          }}
          label="Item ID"
          required
          isValid={valid}
          isInvalid={error}
          feedback={error}
          defaultValue={props.item.itemId}
        />
        <div className="d-flex w-100">
          <SubmitButton>Save</SubmitButton>
          <div className="px-1"></div>
          <CancelButton onClick={props.onCancel} />
        </div>
        {/* {mutationError && (
          <ErrorMessage className="w-100 mt-3" error={mutationError.message} />
        )} */}
      </Form>
    );
  }

  return (
    <Form
      onSubmit={e => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Input
        onChange={e => {
          setValid(false);
          setState(e.target.value);
        }}
        // value={state}
        // value={props.item.itemId}
        label="Item ID"
        required
        isValid={valid}
        isInvalid={error}
        feedback={error}
        append={
          <DepthButton
            type="submit"
            className="rounded-right"
            style={{ borderLeft: "none", marginLeft: 1 }}
          >
            <FontAwesomeIcon
              icon={["fal", "plus"]}
              size="xs"
              className="mr-1"
              style={{ position: "relative", bottom: "0.2em" }}
            />
            <FontAwesomeIcon icon={["fas", "cube"]} className="mr-sm-2" />
            <div className="d-none d-sm-inline">
              Add item to {descriptionName}
            </div>
          </DepthButton>
        }
      />
    </Form>
  );
};
