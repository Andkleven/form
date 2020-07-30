import React from "react";
import Item from "./Item";
import ItemGrid from "components/layout/ItemGrid";
import { Col } from "react-bootstrap";
import { useSpring, animated } from "react-spring";

export default props => {
  const spring = useSpring({
    from: {
      transform: "scale(0.75, 0)"
    },
    to: {
      transform: "scale(1, 1)"
    },
    config: {
      tension: 500,
      friction: 20,
      // clamp: true,
      mass: 0.75
    }
  });

  const items = props.items.map((item, index) => {
    return (
      <Col
        sm="12"
        md="6"
        lg="4"
        xl="3"
        key={`${index}-${item.itemId}-Container`}
      >
        <animated.div style={spring}>
          <Item
            {...props}
            key={`${index}-Item-${item.itemId}`}
            item={item}
            submitItem={props.submitItem}
            submitDelete={props.submitDelete}
          />
        </animated.div>
      </Col>
    );
  });

  // return <ul className="events__list">{items}</ul>;
  return <ItemGrid>{items}</ItemGrid>;
};
