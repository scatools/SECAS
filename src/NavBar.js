import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';

const Nav = () => {
	return (
		<Navbar bg="dark" variant="dark" fixed="top">
			<Navbar.Brand href="#home">
				<Link to="/" style={{ color: 'white', textDecoration: 'None' }}>
					Action Impact Tool
				</Link>
			</Navbar.Brand>
		</Navbar>
	);
};

export default Nav;
