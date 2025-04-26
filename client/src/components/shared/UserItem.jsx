import { Avatar, IconButton, ListItem, Stack, Typography } from '@mui/material';
import React, { memo } from 'react';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { transformImage } from '../../lib/features';

const UserItem = ({ user, handler, handlerIsLoading, isAdded = false, styling = {} }) => {
  const { name, _id, avatar } = user;

  return (
    <ListItem sx={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
      <Stack
        direction={'row'}
        alignItems={'center'}
        spacing={2}
        width={'100%'}
        {...styling}
      >
        {/* Avatar */}
        <Avatar 
          src={transformImage(avatar)} 
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          }}
        />

        {/* Name */}
        <Typography
          sx={{
            flexGrow: 1,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontWeight: '600',
            fontSize: '1rem',
            color: '#333',
          }}
        >
          {name}
        </Typography>

        {/* Add/Remove Button */}
        <IconButton
          size='small'
          sx={{
            bgcolor: isAdded ? 'error.main' : 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: isAdded ? 'error.dark' : 'primary.dark',
            },
            borderRadius: '50%',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
          }}
          onClick={() => handler(_id)}
          disabled={handlerIsLoading}
        >
          {isAdded ? <RemoveIcon /> : <AddIcon />}
        </IconButton>
      </Stack>
    </ListItem>
  );
};

export default memo(UserItem);
