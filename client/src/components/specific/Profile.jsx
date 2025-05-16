import React from 'react';
import { Avatar, Stack, Typography, Box, useTheme, alpha } from '@mui/material';
import {
  Face as FaceIcon,
  AlternateEmail as UserNameIcon,
  CalendarMonth as CalenderIcon
} from '@mui/icons-material';
import moment from 'moment';
import { transformImage } from '../../lib/features';
import { motion } from 'framer-motion';

const Profile = ({ user }) => {
  const theme = useTheme();

  return (
    <Stack 
      direction="column" 
      spacing={3} 
      alignItems="center"
      sx={{
        p: 3,
        maxWidth: '500px',
        mx: 'auto',
        color: 'white' // Set default text color to white
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Avatar
          src={transformImage(user?.avatar?.url)}
          sx={{
            width: 150,
            height: 150,
            objectFit: "cover",
            border: `5px solid ${alpha(theme.palette.common.white, 0.2)}`,
            boxShadow: theme.shadows[6],
            mb: 2,
          }}
        />
      </motion.div>

      <ProfileCard 
        heading="Bio" 
        text={user?.bio || "No bio yet"} 
        icon={<FaceIcon />} 
      />
      
      <ProfileCard 
        heading="Username" 
        text={user?.username} 
        icon={<UserNameIcon />} 
      />
      
      <ProfileCard 
        heading="Name" 
        text={user?.name} 
        icon={<FaceIcon />} 
      />
      
      <ProfileCard 
        heading="Joined" 
        text={moment(user?.createdAt).fromNow()} 
        icon={<CalenderIcon />} 
      />
    </Stack>
  );
};

const ProfileCard = ({ text, icon, heading }) => {
  const theme = useTheme();

  return (
    <motion.div
      whileHover={{ y: -3 }}
      style={{ width: '100%' }}
    >
      <Box 
        sx={{
          bgcolor: alpha(theme.palette.common.white, 0.1),
          borderRadius: 2,
          p: 2,
          width: '100%',
          boxShadow: theme.shadows[1],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: theme.shadows[3],
            bgcolor: alpha(theme.palette.common.white, 0.2),
          },
          border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
          color: 'white' // Set text color to white
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          {icon && (
            <Box sx={{ 
              color: 'white',
              fontSize: '1.8rem',
              p: 1,
              bgcolor: alpha(theme.palette.common.white, 0.2),
              borderRadius: '50%',
              display: 'flex',
            }}>
              {icon}
            </Box>
          )}
          <Stack>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 600,
                color: 'white',
                lineHeight: 1.3
              }}
            >
              {text}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: alpha(theme.palette.common.white, 0.7),
                textTransform: 'uppercase',
                letterSpacing: 1,
                fontSize: '0.7rem'
              }}
            >
              {heading}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </motion.div>
  );
};

export default Profile;