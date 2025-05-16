import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import { VisuallyHiddenInput } from '../components/styles/StyledComponents';
import { useFileHandler, useInputValidation } from '6pp';
import { usernameValidator } from '../utils/validators';
import { bgGradient } from '../constants/color';
import axios from 'axios';
import { server } from '../constants/config';
import { useDispatch } from 'react-redux';
import { userExists } from '../redux/reducers/auth';
import toast from 'react-hot-toast';

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const name = useInputValidation('');
  const password = useInputValidation('');
  const bio = useInputValidation('');
  const username = useInputValidation('', usernameValidator);
  const avatar = useFileHandler('single');
  const dispatch = useDispatch();
  const toggleLogin = () => setIsLogin(!isLogin);

  const handleLogin = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Logging In...");
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/v1/user/login`,
        { username: username.value, password: password.value },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );
      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Signing Up...");
    setIsLoading(true);
    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("username", username.value);
    formData.append("bio", bio.value);
    formData.append("password", password.value);
    try {
      const { data } = await axios.post(`${server}/api/v1/user/new`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });
      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: bgGradient,
        minHeight: '100vh',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            p: isMobile ? 3 : 4,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            mb={2}
            textAlign="center"
            fontWeight="bold"
          >
            {isLogin ? "Login" : "Sign Up"}
          </Typography>

          <form onSubmit={isLogin ? handleLogin : handleSignUp}>
            {!isLogin && (
              <>
                <Stack position="relative" width="6rem" mx="auto" mt={1} mb={1}>
                  <Avatar
                    src={avatar.preview}
                    sx={{
                      width: '6rem',
                      height: '6rem',
                      border: '2px solid #1976d2',
                      boxShadow: 2,
                    }}
                  />
                  <IconButton
                    component="label"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: '#1976d2',
                      color: '#fff',
                      ":hover": { bgcolor: '#115293' },
                      border: '2px solid white',
                    }}
                  >
                    <CameraAltIcon fontSize="small" />
                    <VisuallyHiddenInput type="file" onChange={avatar.changeHandler} />
                  </IconButton>
                </Stack>
                {avatar.error && (
                  <Typography color="error" textAlign="center" variant="caption" mb={1}>
                    {avatar.error}
                  </Typography>
                )}
                <TextField
                  fullWidth
                  label="Name"
                  required
                  margin="dense"
                  value={name.value}
                  onChange={name.changeHandler}
                />
                <TextField
                  fullWidth
                  label="Bio"
                  required
                  margin="dense"
                  value={bio.value}
                  onChange={bio.changeHandler}
                />
              </>
            )}

            <TextField
              fullWidth
              label="Username"
              required
              margin="dense"
              value={username.value}
              onChange={username.changeHandler}
            />
            {username.error && (
              <Typography color="error" variant="caption">
                {username.error}
              </Typography>
            )}
            <TextField
              fullWidth
              label="Password"
              type="password"
              required
              margin="dense"
              value={password.value}
              onChange={password.changeHandler}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 1,
                textTransform: 'none',
                fontWeight: 'bold',
                backgroundColor: '#1976d2',
                ":hover": { backgroundColor: '#115293' },
              }}
            >
              {isLogin ? "Login" : "Sign Up"}
            </Button>

            <Typography textAlign="center" mt={1} mb={1}>or</Typography>

            <Button
              fullWidth
              variant="text"
              onClick={toggleLogin}
              disabled={isLoading}
              sx={{ textTransform: 'none' }}
            >
              {isLogin ? "Sign Up Instead?" : "Login Instead?"}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
