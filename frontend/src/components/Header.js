import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Box, IconButton, Drawer, List, ListItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import logo from '../assets/logo.png';
import Base_Url from '../config.js';
import axios from 'axios';

const NavButton = styled(Button)(({ theme }) => ({
  color: '#f1f2f0',
  marginLeft: theme.spacing(2),
  fontSize: '18px',
  fontWeight: 'bold',
}));

const LoginButton = styled(Button)(({ theme }) => ({
  width: '100px',
  backgroundColor: '#f1f2f0',
  color: '#333',
  marginLeft: theme.spacing(10),
  marginRight: theme.spacing(5),
  fontSize: '18px',
  fontWeight: 'bold',
}));

const LogoutButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#CA4300',
  color: '#f0f0f0',
  marginLeft: theme.spacing(10),
  marginRight: theme.spacing(5),
  fontSize: '18px',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: '#f0f0f0',
    color: '#CA4300',
  },
}));

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // !----------------------------
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        Base_Url + 'auth/sign-out',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            accept: 'application/json',
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log('Sign out successful:', response.data);
        setSuccessMessage('You have been signed out successfully!');

        localStorage.removeItem('access_token');
        setIsLoggedIn(false);

        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    } catch (error) {
      console.error('Error during sign out:', error.response ? error.response.data : error.message);
      setError(error.response?.data?.detail || 'Failed to log out. Please try again.');
    }
  };

  const handleLogin = () => {
    navigate('/login');
    setIsLoggedIn(true);
  };

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  return (
    <AppBar position="sticky" sx={{ background: 'linear-gradient(135deg, #4CAF50, #263d60)' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box component={Link} to="/" sx={{ textDecoration: 'none' }}>
          <img src={logo} alt="Logo" style={{ height: '45px', marginLeft: '10px' }} />
        </Box>
        {isMobile ? (
          <>
            <IconButton onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
              <List>
                <ListItem button component={Link} to="/">Home</ListItem>
                <ListItem button component={Link} to="/about">About Us</ListItem>
                <ListItem button component={Link} to="/contact">Contact Us</ListItem>
                {!isLoggedIn ? (
                  <ListItem button component={Link} to="/login">Sign In</ListItem>
                ) : (
                  <>
                    <ListItem button component={Link} to={`/account`}>Account</ListItem>
                    <LogoutButton onClick={handleLogout}>Sign Out</LogoutButton>
                  </>
                )}
              </List>
            </Drawer>
          </>
        ) : (
          <Box>
            <NavButton component={Link} to="/">Home</NavButton>
            <NavButton component={Link} to="/about">About Us</NavButton>
            <NavButton component={Link} to="/contact">Contact Us</NavButton>
            {!isLoggedIn ? (
              // <LoginButton component={Link} to="/login">Sign In</LoginButton>
              <LoginButton onClick={handleLogin}>Sign In</LoginButton>
            ) : (
              <>
                <NavButton component={Link} to={`/account`}>Account</NavButton>
                <LogoutButton onClick={handleLogout}>Sign Out</LogoutButton>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;