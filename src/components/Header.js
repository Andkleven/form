// import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import { withRouter } from "react-router";
// import { AUTH_TOKEN } from "../constants";

// class Header extends Component {
//   render() {
//     const authToken = localStorage.getItem(AUTH_TOKEN);
//     return (
//       <div className="flex pa1 justify-between nowrap orange">
//         <div className="flex flex-fixed black">
//           <div className="fw7 mr1">Hacker News</div>
//           {authToken && (
//             <div className="flex">
//               <div className="ml1">|</div>
//               <Link to="/" className="ml1 no-underline black">
//                 Home
//               </Link>
//               <div className="ml1">|</div>
//               <Link to="/order" className="ml1 no-underline black">
//                 Order
//               </Link>
//             </div>
//           )}

//           <div className="flex flex-fixed">
//             {authToken ? (
//               <div
//                 className="ml1 pointer black"
//                 onClick={() => {
//                   localStorage.removeItem(AUTH_TOKEN);
//                   this.props.history.push(`/login`);
//                 }}
//               >
//                 logout
//               </div>
//             ) : (
//               <Link to="/login" className="ml1 no-underline black">
//                 login
//               </Link>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default withRouter(Header);

import React from "react";
import { Navbar, Dropdown } from "react-bootstrap";
import emblem from "../images/trelleborg_emblem.png";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import { AUTH_TOKEN } from "../constants";

const authToken = localStorage.getItem(AUTH_TOKEN);

function NavbarSolid() {
  return (
    <>
      {/* {authToken && ( */}
      <Navbar
        sticky="top"
        bg="dark"
        variant="dark"
        className="text-light mx-0 px-2 shadow-sm"
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
