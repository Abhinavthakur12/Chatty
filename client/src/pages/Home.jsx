import React from 'react'
import AppLayout from '../components/layout/AppLayout';
import { Box, Typography } from '@mui/material';
import { grayColor, matBlack } from '../constants/color';

const Home = () => {
  return (
    <Box
      bgcolor={grayColor}
      height="100%"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(to bottom, #F0F0F0, #E0E0E0)',
        overflow:"hidden"
      }}
    >
      <Typography
        variant="h4"
        color={matBlack}
        fontWeight="600"
        sx={{
          marginBottom: '2rem',
          textShadow: '1px 1px 4px rgba(0, 0, 0, 0.2)',
        }}
        align="center"
      >
        Welcome to the Chatty
      </Typography>

      <Typography
        variant="body1"
        color={matBlack}
        sx={{
          marginBottom: '1rem',
          textAlign: 'center',
          fontSize: '1rem',
        }}
      >
        Select chat to chat
      </Typography>

      {/* Optionally add login or other call-to-action buttons here */}

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          position: 'absolute',
          bottom: '1rem',
          fontSize: '0.9rem',
          textAlign: 'center',
        }}
      >
        Chatty - All rights reserved
      </Typography>
    </Box>
  )
}

export default AppLayout(Home);
