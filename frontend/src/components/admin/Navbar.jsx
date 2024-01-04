/*
* Navbar
*
* General navbar across all pages, renders different tabs depending on whether a user is logged in
* Includes links to hosted listings, create listings, log out and search
*
*/
import React, { useContext, useState } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../utils/AuthContext.jsx';
import ErrorPopup from '../error/Error.jsx';
import { LogoutModal } from '../admin/Logout.jsx';
import SearchPopup from './SearchPopup.jsx';
import styled from 'styled-components';

const NavContainer = styled.div`
  display: flex;
  align-items: center;
`;

const NavigationBar = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleCloseError = () => {
    setError('');
  };
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);

  const handleIconClick = (value = true) => {
    setIsSearchPopupOpen(value);
  };
  const NavbarComp = styled(Navbar)`
    width: 100%;
    padding: 0.8rem 7rem 0.8rem 2.9rem;
    @media screen and (max-width: 850px) {
      padding: 0;
    }
  `;
  const NavComp = styled(Nav)`
    position: absolute;
    right: 10px;
    @media screen and (max-width: 850px) {
      margin-left: 0%;
    }
  `;
  const NavRed = styled.div`
    color: #ff385c;
    font-size: 1.5rem;
    font-weight: 600;
  `;
  return (
    /* Bootstrap Modal */
    <>
    <NavbarComp bg="light" expand="lg">
      <Navbar.Brand href="/"><NavRed>AirBrB</NavRed></Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
      <NavComp className="mr-auto">
        {isLoggedIn
          ? (
            <NavContainer>
              <i className="fa-solid fa-magnifying-glass" onClick={handleIconClick} data-testid="search-icon"></i>
              {isSearchPopupOpen && <SearchPopup handleIconClick={handleIconClick} data-testid="search-popup" />}
              <Nav.Link onClick={() => navigate('/hosted-listings')}>Hosted Listings</Nav.Link>
              <Nav.Link onClick={() => navigate('/new-listing')}>Create Listing</Nav.Link>
              <Button variant="outline-danger" onClick={() => setShowLogoutModal(true)} data-testid="logout-button">Logout</Button>
            </NavContainer>
            )
          : (
            <>
              <Nav.Link onClick={() => navigate('/login')}>Login</Nav.Link>
              <Nav.Link onClick={() => navigate('/register')}>Register</Nav.Link>
            </>
            )
        }
      </NavComp>
      </Navbar.Collapse>
    </NavbarComp>
    {error && <ErrorPopup message={error} onClose={handleCloseError} />}
    <LogoutModal
      show={showLogoutModal}
      onHide={() => setShowLogoutModal(false)}
    />
    </>
  );
};

export default NavigationBar;
