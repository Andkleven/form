import React from "react";
import { Navbar, Dropdown } from "react-bootstrap";
import emblem from "images/emblem.png";
import "styles/styles.css";
import { LinkContainer } from "react-router-bootstrap";
import { USER } from "constants.js";
import { camelCaseToNormal } from "functions/general";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default () => {
  const userInfo = JSON.parse(localStorage.getItem(USER)); // Local user info

  const NavLink = props => (
    <LinkContainer to={props.link} className="p-0">
      <Dropdown.Item>
        <div className="nav-link">
          <FontAwesomeIcon icon={props.icon} style={{ width: "1.7em" }} />
          {props.title}
        </div>
      </Dropdown.Item>
    </LinkContainer>
  );

  return (
    <Navbar
      collapseOnSelect
      // sticky="top"
      bg="dark"
      variant="dark"
      className="text-light mx-0 px-1 w-100 shadow header"
      style={{ height: 42 }}
      fixed="top"
    >
      {/* Left */}
      <div className="w-100 mx-0 px-0 d-flex justify-content-start">
        <Dropdown id="dropdown-left">
          <Dropdown.Toggle variant="dark" className="caret-off py-1 px-2">
            <div style={{ opacity: 1 }}>
              <FontAwesomeIcon icon="bars" />
              <div className="ml-2 d-inline">Menu</div>
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <NavLink title="Home" link="/" icon="home" />
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Center */}
      <div className="col-4 text-center mx-0 px-0">
        <a href="/" className="m-0 p-0">
          <img
            src={emblem}
            height="25"
            className="d-inline-block align-top"
            alt="React Bootstrap logo"
          />
        </a>
      </div>

      {/* Right */}
      <div className="w-100 mx-0 px-0 d-flex justify-content-end">
        <Dropdown>
          <Dropdown.Toggle variant="dark" className="caret-off py-1 px-2">
            <div style={{ opacity: 1 }}>
              {/* Large */}
              <div className="d-none d-sm-block">
                <div className="d-inline">
                  {userInfo
                    ? `${camelCaseToNormal(
                        userInfo.username
                      )} (${camelCaseToNormal(userInfo.role.toLowerCase())})`
                    : "role • name"}
                </div>
                <FontAwesomeIcon icon="user" className="ml-2" />
              </div>
              {/* Small */}
              <div className="d-block d-sm-none">
                <div className="d-inline">
                  {userInfo
                    ? `${camelCaseToNormal(userInfo.role.toLowerCase())}`
                    : "role • name"}
                </div>
                <FontAwesomeIcon icon="user" className="ml-2" />
              </div>
            </div>
          </Dropdown.Toggle>

          <Dropdown.Menu alignRight>
            <NavLink title="Logout" link="/login" icon="user" />
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </Navbar>
  );
};
