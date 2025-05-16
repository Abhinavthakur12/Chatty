import React, { memo } from 'react';
import { Link } from '../styles/StyledComponents';
import { Stack, Typography, Box, Divider, useTheme } from '@mui/material';
import AvatarCard from './AvatarCard';
import { motion } from 'framer-motion';

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {
  const theme = useTheme();

  return (
    <Link
      sx={{ 
        padding: 0, 
        textDecoration: 'none',
        display: 'block',
      }}
      to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <motion.div
        initial={{ opacity: 0, y: '-10%' }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          delay: index * 0.05,
          type: 'spring',
          stiffness: 100,
          damping: 10
        }}
        whileHover={{
          scale: 1.02,
          backgroundColor: sameSender 
            ? theme.palette.action.hover 
            : theme.palette.action.selected,
        }}
        whileTap={{ scale: 0.98 }}
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          padding: '1rem',
          backgroundColor: sameSender 
            ? theme.palette.action.selected 
            : 'transparent',
          color: sameSender 
            ? theme.palette.text.primary 
            : theme.palette.text.secondary,
          borderRadius: theme.shape.borderRadius,
          position: 'relative',
          cursor: 'pointer',
          transition: 'all 0.2s ease-out',
        }}
      >
        <AvatarCard avatar={avatar} />

        <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 1,
          }}>
            <Typography
              variant="subtitle1"
              fontWeight="600"
              sx={{
                color: 'inherit',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {name}
            </Typography>
            
            {isOnline && (
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.success.main,
                  boxShadow: `0 0 8px ${theme.palette.success.main}`,
                  flexShrink: 0,
                }}
              />
            )}
          </Box>

          {newMessageAlert && (
            <Typography
              variant="caption"
              sx={{
                backgroundColor: theme.palette.error.main,
                padding: '0.1rem 0.5rem',
                borderRadius: '0.5rem',
                fontWeight: '500',
                color: theme.palette.error.contrastText,
                width: 'fit-content',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              {newMessageAlert.count} New Message{newMessageAlert.count > 1 ? 's' : ''}
            </Typography>
          )}
        </Stack>

        {!isOnline && newMessageAlert && (
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: theme.palette.error.main,
              position: 'absolute',
              right: 12,
              top: 12,
            }}
          />
        )}
      </motion.div>

      <Divider 
        sx={{
          borderColor: theme.palette.divider,
          borderBottomWidth: 1,
          mx: 2,
          opacity: 0.5,
        }} 
      />
    </Link>
  );
};

export default memo(ChatItem);