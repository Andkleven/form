import React from "react";
import { Navbar, Dropdown } from "react-bootstrap";
import emblem from "images/emblem.png";
import "styles/styles.css";
import { LinkContainer } from "react-router-bootstrap";
import { USER } from "constants.js";
import { camelCaseToNormal } from "functions/general";

export default () => {
  const userInfo = JSON.parse(localStorage.getItem(USER)); // Local user info

  const NavLink = props => (
    <LinkContainer to={props.link} className="p-0">
      <Dropdown.Item>
        <div className="nav-link">
          <i style={{ width: "1.7em" }} className={`fas fa-${props.icon}`} />
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
      className="text-light mx-0 px-1 w-100 shadow"
      style={{ height: 42 }}
      sticky="top"
    >
      {/* Left */}
      <div className="w-100 mx-0 px-0 d-flex justify-content-start">
        <Dropdown id="dropdown-left">
          <Dropdown.Toggle variant="dark" className="caret-off py-1 px-2">
            <div style={{ opacity: 1 }}>
              <i className="fas fa-bars mt-1" />
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
                      )} (${camelCaseToNormal(
                        userInfo.employee.toLowerCase()
                      )})`
                    : "role • name"}
                </div>
                <i className="fas fa-user ml-2" />
              </div>
              {/* Small */}
              <div className="d-block d-sm-none">
                <div className="d-inline">
                  {userInfo
                    ? `${camelCaseToNormal(userInfo.employee.toLowerCase())}`
                    : "role • name"}
                </div>
                <i className="fas fa-user ml-2" />
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
