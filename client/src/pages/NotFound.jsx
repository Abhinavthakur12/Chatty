import { Error as ErrorIcon } from '@mui/icons-material';
import { Container, Stack, Typography, Button, useTheme, alpha } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  const theme = useTheme();

  return (
    <Container 
      maxWidth="lg" 
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.background.default, 0.3)} 100%)`,
      }}
    >
      <Stack
        justifyContent="center"
        alignItems="center"
        spacing={4}
        sx={{
          p: 6,
          borderRadius: 4,
          boxShadow: theme.shadows[10],
          background: alpha(theme.palette.background.paper, 0.9),
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ErrorIcon sx={{ 
            fontSize: "8rem", 
            color: theme.palette.error.main 
          }}/>
        </motion.div>

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Typography 
            variant="h1" 
            sx={{ 
              fontWeight: 700,
              color: theme.palette.text.primary,
              fontSize: "6rem",
              lineHeight: 1
            }}
          >
            404
          </Typography>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 500,
              color: theme.palette.text.secondary,
              textAlign: "center"
            }}
          >
            Oops! The page you're looking for doesn't exist.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            component={Link}
            to="/"
            variant="contained"
            size="large"
            sx={{
              mt: 3,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
              fontSize: "1.1rem"
            }}
          >
            Return to Home Page
          </Button>
        </motion.div>
      </Stack>
    </Container>
  );
};

export default NotFound;