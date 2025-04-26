import { Avatar, Stack } from '@mui/material';
import React from 'react';
import { transformImage } from '../../lib/features';

const AvatarCard = ({ avatar = [], max = 4 }) => {
  // Limit number of avatars to "max"
  const displayedAvatars = avatar.slice(0, max);

  return (
    <Stack direction="row" spacing={-1}>
      {displayedAvatars.map((item, index) => (
        <Avatar
          key={index}
          src={transformImage(item)}
          alt={`Avatar ${index + 1}`}
          sx={{
            width: { xs: '2.5rem', sm: '3rem' },
            height: { xs: '2.5rem', sm: '3rem' },
            border: '2px solid #121212',
            zIndex: avatar.length - index,
            boxShadow: '0 0 5px rgba(0,0,0,0.5)',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.05)',
              zIndex: 999,
            },
          }}
        />
      ))}
    </Stack>
  );
};

export default AvatarCard;
