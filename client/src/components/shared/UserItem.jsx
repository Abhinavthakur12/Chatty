import { Avatar, IconButton, ListItem, Stack, Typography, useTheme, alpha } from '@mui/material';
import React, { memo } from 'react';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { transformImage } from '../../lib/features';
import { motion } from 'framer-motion';

const UserItem = ({ user, handler, handlerIsLoading, isAdded = false, styling = {} }) => {
  const theme = useTheme();
  const { name, _id, avatar } = user;

  return (
    <ListItem 
      sx={{ 
        padding: '1rem', 
        borderBottom: `1px solid ${theme.palette.divider}`,
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
        },
        transition: 'background-color 0.2s ease-in-out',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        style={{ width: '100%' }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          width="100%"
          {...styling}
        >
          {/* Avatar with subtle animation */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <Avatar 
              src={transformImage(avatar)} 
              sx={{
                width: 48,
                height: 48,
                boxShadow: theme.shadows[1],
                border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            />
          </motion.div>

          {/* Name with better typography */}
          <Typography
            variant="subtitle1"
            sx={{
              flexGrow: 1,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            {name}
          </Typography>

          {/* Animated Add/Remove Button */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconButton
              size="small"
              sx={{
                bgcolor: isAdded ? 'error.main' : 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: isAdded ? 'error.dark' : 'primary.dark',
                },
                boxShadow: theme.shadows[2],
                transition: 'all 0.2s ease-in-out',
              }}
              onClick={() => handler(_id)}
              disabled={handlerIsLoading}
            >
              {isAdded ? <RemoveIcon fontSize="small" /> : <AddIcon fontSize="small" />}
            </IconButton>
          </motion.div>
        </Stack>
      </motion.div>
    </ListItem>
  );
};

export default memo(UserItem);