import React from "react";
import { Navbar, Dropdown } from "react-bootstrap";
import emblem from "../images/trelleborg_emblem.png";
import { Link } from "react-router-dom";
// import { withRouter } from "react-router";
// import { AUTH_TOKEN } from "../constants";

// const authToken = localStorage.getItem(AUTH_TOKEN);

const NavLink = props => (
  <Dropdown.Item className="p-0">
    <Link to={props.link} className="text-decoration-none">
      <div className="w-100 px-3 py-1 text-dark">
        <i style={{ width: "1.5em" }} className={`fas fa-${props.icon}`} />
        {props.title}
      </div>
    </Link>
  </Dropdown.Item>
);

export default () => (
  <Navbar
    // sticky="top"
    bg="dark"
    variant="dark"
    className="text-light mx-0 px-2 position-absolute w-100"
  >
    {/* Left */}
    <div className="w-100 mx-0 px-0 d-flex justify-content-start">
      <Dropdown className="mx-0 px-0">
        <Dropdown.Toggle variant="dark" className="caret-off py-1">
          <i className="fas fa-bars fa-lg mt-1" />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <NavLink title="Home" link="/" icon="home" />
          <NavLink title="Orders" link="/orders" icon="list" />
          <NavLink title="Operator" link="/operator" icon="user-hard-hat" />
        </Dropdown.Menu>
      </Dropdown>
    </div>

    {/* Center */}
    <div className="col-4 text-center mx-0 px-0">
      <a href="/" className="m-0 p-0">
        <img
          src={emblem}
          height="35"
          className="d-inline-block align-top"
          alt="React Bootstrap logo"
        />
      </a>
    </div>

    {/* Right */}
    <div className="w-100 mx-0 px-0 d-flex justify-content-end">
      <Dropdown className="">
        <Dropdown.Toggle variant="dark" className="caret-off">
          <div className="d-none d-sm-block">
            userRole • ID <i className="fas fa-user ml-2" />
          </div>
          <div className="d-block d-sm-none">
            ID <i className="fas fa-user ml-2" />
          </div>
        </Dropdown.Toggle>

        <Dropdown.Menu alignRight>
          <NavLink title="Logout" link="/login" icon="user" />
        </Dropdown.Menu>
      </Dropdown>
    </div>
  </Navbar>
);
