import React from "react";
import { Button } from "react-bootstrap";

import "../styles/styles.css";

function NavbarSolid(props) {
  return (
    <>
      <style type="text/css">
        {`
        .btn-trelleborg { 
          color: #FFFFFF; 
          background-color: #F3A63A; 
          border-color: #F3A63A; 
        } 
         
        .btn-trelleborg:hover, 
        .btn-trelleborg:focus, 
        .btn-trelleborg:active, 
        .btn-trelleborg.active, 
        .open .dropdown-toggle.btn-trelleborg { 
          color: #FFFFFF; 
          background-color: #E09936; 
          border-color: #F3A63A; 
        } 
         
        .btn-trelleborg:active, 
        .btn-trelleborg.active, 
        .open .dropdown-toggle.btn-trelleborg { 
          background-image: none; 
        } 
         
        .btn-trelleborg.disabled, 
        .btn-trelleborg[disabled], 
        fieldset[disabled] .btn-trelleborg, 
        .btn-trelleborg.disabled:hover, 
        .btn-trelleborg[disabled]:hover, 
        fieldset[disabled] .btn-trelleborg:hover, 
        .btn-trelleborg.disabled:focus, 
        .btn-trelleborg[disabled]:focus, 
        fieldset[disabled] .btn-trelleborg:focus, 
        .btn-trelleborg.disabled:active, 
        .btn-trelleborg[disabled]:active, 
        fieldset[disabled] .btn-trelleborg:active, 
        .btn-trelleborg.disabled.active, 
        .btn-trelleborg[disabled].active, 
        fieldset[disabled] .btn-trelleborg.active { 
          background-color: #F3A63A; 
          border-color: #F3A63A; 
        } 
         
        .btn-trelleborg .badge { 
          color: #F3A63A; 
          background-color: #FFFFFF; 
        }
        `}
      </style>
      <Button
        type="submit"
        className="w-100 mt-4"
        variant="trelleborg"
        onClick={props.onClick}
      >
        <i className="fas fa-check fa-2x" />
        <div>Save and Continue</div>
      </Button>
    </>
  );
}

export default NavbarSolid;
