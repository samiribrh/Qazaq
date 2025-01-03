import React, { useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Avatar, Typography, Container, CircularProgress, IconButton, InputAdornment , Link} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import './AdminLogin.css';
import Base_url from '../../config.js';

const theme = createTheme();

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); 
    setIsLoading(true); 
  
    try {
      const response = await axios.post(
        Base_url + 'auth/admin/sign-in',
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
          },
          withCredentials: true,
        }
      );
  
      if (response.status === 200) {
        console.log('Login successful:', response.data);
  
        navigate('/admin')
        const { access_token, user_id } = response.data;
  
        if (access_token) {
          localStorage.setItem('access_token', access_token);
          console.log(access_token);
        }
        if (user_id) {
          localStorage.setItem('user_id', user_id);
        }

      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail === 'User not verified') {
        setIsLoading(false);
      } else {
        console.error('Login failed:', error.response ? error.response.data : error.message);
        setError('User is not an admin');
        setIsLoading(false);
      }
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          backgroundImage: `url('https://images.wallpaperscraft.ru/image/single/pole_trava_tropinka_124349_2560x1600.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          animation: 'fadeIn 1s ease-in-out',
        }}
      >
        <Container
          component="main"
          maxWidth="xs"
          sx={{
            border: '1px solid #ccc',
            borderRadius: '12px',
            backgroundColor: 'rgba(240, 240, 240, 0.9)',
            padding: '30px',
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
            animation: 'slideUp 0.8s ease',
          }}
        >
          <Box
            sx={{
              marginTop: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'black' }}>
              <AccountCircleIcon />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
              Admin
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {error && (
                <Typography color="error" align="center" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: '#333',
                  '&:hover': { backgroundColor: '#000' },
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
