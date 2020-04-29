import React, { useState } from "react";
import ItemUpdate from "components/../page/ItemUpdate";

export default (props) => {
  const [show, setShow] = useState(false);
  return (
    <li key={props.id}>
      <div>
        <h1>
          {props.item.id}
          {props.item.itemId}
        </h1>
      </div>
      <div>
        <button
          className="btn"
          onClick={props.submitItem.bind(this, props.item)}
        >
          Item
        </button>
        <button
          className="btn"
          onClick={props.submitDelete.bind(this, props.item.id)}
        >
          Delete
        </button>
        <button className="btn" onClick={() => setShow(true)}>
          Edit
        </button>
        {show && (
          <>
            <ItemUpdate
              {...props}
              id={props.item.id}
              value={props.item.itemId}
              done={() => setShow(false)}
            />
            <button className="btn" onClick={() => setShow(false)}>
              cancel
            </button>
          </>
        )}
      </div>
    </li>
  );
};
