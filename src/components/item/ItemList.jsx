import React from "react";
import Item from "./Item";
import ItemGrid from "components/layout/ItemGrid";
import { Col } from "react-bootstrap";

export default props => {
  const items = props.items.map((item, index) => {
    return (
      <Col
        sm="12"
        md="6"
        lg="4"
        xl="3"
        key={`${index}-${item.itemId}-Container`}
      >
        <Item
          {...props}
          key={`${index}-Item-${item.itemId}`}
          item={item}
          submitItem={props.submitItem}
          submitDelete={props.submitDelete}
        />
      </Col>
    );
  });

  // return <ul className="events__list">{items}</ul>;
  return <ItemGrid>{items}</ItemGrid>;
};
