import React from "react";
import { Navbar, Dropdown } from "react-bootstrap";
import emblem from "../images/trelleborg_emblem.png";
// import { Link } from "react-router-dom";
// import { withRouter } from "react-router";
// import { AUTH_TOKEN } from "../constants";

// const authToken = localStorage.getItem(AUTH_TOKEN);

function NavbarSolid() {
  return (
    <>
      {/* {authToken && ( */}
      <Navbar
        // sticky="top"
        bg="dark"
        variant="dark"
        className="text-light mx-0 px-2 shadow-sm position-absolute w-100"
      >
        {/* Left */}
        <div className="w-100 mx-0 px-0 d-flex justify-content-start">
          <Dropdown className="mx-0 px-0">
            <Dropdown.Toggle variant="dark" className="caret-off py-1">
              <i className="fas fa-bars fa-lg mt-1" />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="/">
                <i style={{ width: "1.5em" }} className="fas fa-home" />
                Home
              </Dropdown.Item>
              <Dropdown.Item href="/order">
                <i style={{ width: "1.5em" }} className="fas fa-list" />
                Orders
              </Dropdown.Item>
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
              <Dropdown.Item
                href="/login"
                // onClick={localStorage.removeItem(AUTH_TOKEN)}
              >
                <i style={{ width: "1.5em" }} className="fa fa-user" />
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Navbar>
      {/* )} */}
    </>
  );
}

export default NavbarSolid;
