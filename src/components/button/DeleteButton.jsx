import React from "react";
import { useMutation } from "@apollo/react-hooks";
import Loading from "components/div/Loading";

export default props => {
  const handleDelete = e => {
    e.preventDefault();
    deleteMutation({
      variables: {
        id: props.id
      }
    });
  };
  const [deleteMutation, { loading, error }] = useMutation(
    props.deleteMutation,
    {
      update: props.firstQueryPath ? props.deleteWithVariable : props.deletes
    }
  );

  return (
    <>
      {props.file}
      {props.description}
      <button className="btn" onClick={() => handleDelete}>
        Delete
      </button>
      {loading && <Loading />}
      {error && <p>Error :( Please try again</p>}
    </>
  );
};
