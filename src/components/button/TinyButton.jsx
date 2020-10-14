import React from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
// import {useSpring, animated} from 'react-spring'

export default ({ iconProps, ...props }) => {
  // const [showChildren, setShowChildren] = useState(false);
  // const props = useSpring({ opacity: 1, from: { opacity: 0 } });

  return (
    <OverlayTrigger
      delay={{ show: 1000, hide: 0 }}
      overlay={
        <Tooltip hidden={props.tooltip ? false : true}>{props.tooltip}</Tooltip>
      }
    >
      <Button
        variant="link"
        type={props.type ? props.type : "button"}
        className={`py-0 m-0 ${props.noPadding ? `px-0` : `px-1`} text-center ${
          props.className
        }`}
        onClick={props.onClick}
        // style={{ minWidth: props.noPadding ? `` : `1.8em`, ...props.style }}
        // onMouseEnter={() => setShowChildren(true)}
        // onMouseLeave={() => setShowChildren(false)}
      >
        <span className={`${props.color && `text-${props.color}`} w-100`}>
          {/* {props.icon && (
            <FontAwesomeIcon
              icon={props.icon}
              size={props.iconSize}
              style={props.iconStyle}
              {...iconProps}
            />
          )} */}
          {props.children && (
            // && showChildren
            <div className="ml-1 text-right">{props.children}</div>
          )}
        </span>
      </Button>
    </OverlayTrigger>
  );
};
