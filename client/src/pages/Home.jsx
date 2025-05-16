import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import { Box, Typography, Button, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';

const Home = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 6rem)', // Exact height accounting for header
        position: 'relative',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.background.default, 0.3)} 100%)`,
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 70%)`,
          animation: 'rotate 20s linear infinite',
          '@keyframes rotate': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          p: { xs: 3, sm: 4 }, // Reduced padding
          borderRadius: 4,
          backdropFilter: 'blur(8px)',
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          boxShadow: theme.shadows[10],
          maxWidth: '600px',
          width: '90%',
          textAlign: 'center',
          mx: 'auto', // Center horizontally
          my: 'auto', // Center vertically
        }}
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2, // Reduced margin
              fontSize: { xs: '1.8rem', sm: '2.2rem' }, // Responsive font
              color: theme.palette.text.primary,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Welcome to Chatty
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 3, // Reduced margin
              fontSize: { xs: '1rem', sm: '1.2rem' }, // Responsive font
              color: theme.palette.text.secondary,
              lineHeight: 1.6,
            }}
          >
            Connect with friends and colleagues in real-time.
            <br />
            Select a chat to start messaging.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="contained"
            size="large"
            sx={{
              px: 4,
              py: 1,
              mb: 1, // Added margin bottom
              borderRadius: 2,
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              boxShadow: theme.shadows[4],
              '&:hover': {
                boxShadow: theme.shadows[6],
              },
            }}
          >
            Explore Chats
          </Button>
        </motion.div>
      </Box>

      <Typography
        variant="body2"
        sx={{
          position: 'absolute',
          bottom: '1rem',
          zIndex: 1,
          color: theme.palette.text.secondary,
          fontSize: '0.8rem',
        }}
      >
        © {new Date().getFullYear()} Chatty - All rights reserved
      </Typography>
    </Box>
  );
};

export default AppLayout(Home);