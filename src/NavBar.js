import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "react-bootstrap";

const Nav = () => {
  return (
    <Navbar
      style={{ paddingLeft: "20px" }}
      bg="dark"
      variant="dark"
      fixed="top"
    >
      <Navbar.Brand href="#home">
        <Link
          to="/"
          style={{ color: "white", textDecoration: "None", fontSize: "28px" }}
        >
          Action Impact Tool
        </Link>
      </Navbar.Brand>
    </Navbar>
  );
};

export default Nav;
