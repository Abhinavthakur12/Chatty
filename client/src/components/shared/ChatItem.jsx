import React, { memo, useEffect } from 'react';
import { Link } from '../styles/StyledComponents';
import { Stack, Typography, Box,Divider } from '@mui/material';
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
 
  return (
    <Link
    sx={{ padding: 0, textDecoration: 'none' }}
    to={`/chat/${_id}`}
    onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
  >
    <>
      <motion.div
        initial={{ opacity: 0, y: '-20%' }}
        whileInView={{ opacity: 1, y: '0' }}
        transition={{ delay: index * 0.1 }}
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          padding: '1rem',
          backgroundColor: sameSender ? '#1a1a1a' : 'transparent',
          color: sameSender ? 'white' : '#eee',
          borderRadius: '1rem',
          position: 'relative',
          cursor: 'pointer',
          transition: 'background-color 0.3s, transform 0.2s',
        }}
        whileHover={{
          scale: 1.02,
          backgroundColor: sameSender ? '#222' : 'rgba(255,255,255,0.05)',
        }}
      >
        <AvatarCard avatar={avatar} />
        <Stack spacing={0.5}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{
              color: sameSender ? 'white' : 'black',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '150px',
            }}
          >
            {name}
          </Typography>
  
          {newMessageAlert && (
            <Typography
              variant="caption"
              sx={{
                backgroundColor: '#ff6347',
                padding: '0.1rem 0.4rem',
                borderRadius: '0.5rem',
                fontWeight: '500',
                color: 'white',
                width: 'fit-content',
              }}
            >
              {newMessageAlert.count} New Message{newMessageAlert.count > 1 ? 's' : ''}
            </Typography>
          )}
        </Stack>
  
        {isOnline && (
          <Box
            sx={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: 'limegreen',
              position: 'absolute',
              top: '50%',
              right: '1rem',
              transform: 'translateY(-50%)',
              boxShadow: '0 0 6px limegreen',
            }}
          />
        )}
      </motion.div>
      <Divider sx={{
    borderColor: 'rgba(255, 255, 255, 0.2)', 
    borderBottomWidth: '2px',                 
    marginLeft: '0rem',                      
    marginY: '0.5rem',                        
  }} />
    </>
  </Link>
  
  );
};

export default memo(ChatItem);
