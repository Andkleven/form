import React from "react";
import Item from "./Item";

export default props => {
  const items = props.items.map((item, index) => {
    return (
      <Item
        {...props}
        key={index}
        item={item}
        submitItem={props.submitItem}
        submitDelete={props.submitDelete}
      />
    );
  });
  return <ul className="events__list">{items}</ul>;
};
