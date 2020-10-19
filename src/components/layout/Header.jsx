import React, { useState } from "react";
import { Navbar, Dropdown } from "react-bootstrap";
import emblem from "images/emblem.png";
import "styles/styles.css";
import { LinkContainer } from "react-router-bootstrap";
import { getUser, getAccess } from "functions/user";
import { camelCaseToNormal } from "functions/general";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation, useParams } from "react-router-dom";
// import { ItemContext } from "components/contexts/ItemContext";
import Repair from "components/repair/Repair";
import Files from "components/Files";

export default props => {
  const user = getUser();
  const access = getAccess();

  const showRepairButton =
    ("/single-item/" === useLocation().pathname.slice(0, 13) ||
      "/single-item/" === useLocation().pathname.slice(0, 17)) &&
    access.itemRepair;
  const { itemId, descriptionId } = useParams();
  const showFilesButton = itemId && descriptionId;

  const [showRepair, setShowRepair] = useState(false);
  const [showFiles, setShowFiles] = useState(false);

  // const { item } = useContext(ItemContext);

  const NavLink = ({
    title,
    link,
    icon,
    disabled,
    hidden,
    external = false
  }) => {
    if (external) {
      return (
        <Dropdown.Item
          disabled={disabled}
          hidden={hidden}
          href={external ? link : null}
          className="p-0 w-100"
        >
          <div className={`nav-link ${disabled && `text-light`}`}>
            <FontAwesomeIcon icon={icon} style={{ width: "1.7em" }} />
            {title}
          </div>
        </Dropdown.Item>
      );
    } else {
      return (
        <LinkContainer to={link} className="p-0">
          <Dropdown.Item disabled={disabled} hidden={hidden}>
            <div className={`nav-link ${disabled && `text-light`}`}>
              <FontAwesomeIcon icon={icon} style={{ width: "1.7em" }} />
              {title}
            </div>
          </Dropdown.Item>
        </LinkContainer>
      );
    }
  };
  const NavButton = ({ title, onClick, icon, disabled, hidden }) => (
    <Dropdown.Item
      disabled={disabled}
      hidden={hidden}
      onClick={onClick}
      className="m-0 p-0"
    >
      <div className={`nav-link px-3 py-2 ${disabled && `text-light`} m-0 p-0`}>
        <FontAwesomeIcon icon={icon} style={{ width: "1.7em" }} />
        {title}
      </div>
    </Dropdown.Item>
  );

  return (
    <>
      <Navbar
        collapseOnSelect
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
              {showRepairButton && (
                <>
                  <NavButton
                    title={`Repair`}
                    onClick={() => setShowRepair(true)}
                    icon="tools"
                    // hidden
                  />
                  <Repair
                    id={itemId}
                    show={showRepair}
                    setShow={setShowRepair}
                  />
                </>
              )}
              {showFilesButton && (
                <>
                  <NavButton
                    title={`Files`}
                    onClick={() => setShowFiles(true)}
                    icon="copy"
                  />
                  <Files show={showFiles} setShow={setShowFiles} />
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {/* Center */}
        <div className="col-4 text-center mx-0 px-0">
          <Link to="/" className="m-0 p-0">
            <img
              src={emblem}
              height="25"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
          </Link>
        </div>

        {/* Right */}
        <div className="w-100 mx-0 px-0 d-flex justify-content-end">
          <Dropdown>
            <Dropdown.Toggle variant="dark" className="caret-off py-1 px-2">
              <div style={{ opacity: 1 }}>
                {/* Large */}
                <div className="d-none d-sm-block">
                  <div className="d-inline">
                    {user !== {}
                      ? `${camelCaseToNormal(
                          user.username
                        )} (${camelCaseToNormal(user.role.toLowerCase())})`
                      : "role • name"}
                  </div>
                  <FontAwesomeIcon icon="user" className="ml-2" />
                </div>
                {/* Small */}
                <div className="d-block d-sm-none">
                  <div className="d-inline">
                    {user !== {}
                      ? `${camelCaseToNormal(user.role.toLowerCase())}`
                      : "role • name"}
                  </div>
                  <FontAwesomeIcon icon="user" className="ml-2" />
                </div>
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu alignRight>
              <NavLink title="Logout" link="/login" icon="user" />
              <NavLink
                title="Admin"
                external
                link={`${process.env.REACT_APP_BACKEND}/admin/`}
                icon="user"
              />
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Navbar>
      {props.children}
    </>
  );
};
