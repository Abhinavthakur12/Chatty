import React, { useEffect } from 'react';
import { Stack, IconButton, Box, Typography } from '@mui/material';
import { KeyboardBackspace as KeyboardBackspaceIcon } from '@mui/icons-material';
import ChatItem from '../shared/ChatItem';
import { matBlack } from '../../constants/color';
import { useNavigate } from 'react-router-dom';

const ChatList = ({
  w = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [
    {
      chatId: "",
      count: 0
    }
  ],
  handleDeleteChat
}) => {

  const navigate = useNavigate();

  const navigateBack = () => {
    navigate(-1);
  };
  
  return (
    <Stack
      width={w}
      direction={'column'}
      overflow={"auto"}
      height={"100%"}
      sx={{
        padding: '1rem',
        gap: '0.5rem',
        backgroundColor: '#87747A',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        scrollbarWidth: 'none',       
        '&::-webkit-scrollbar': {
          display: 'none',             
        },
      }}
    >
      {/* Sticky Back Button */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          left: 0,
          zIndex: 10,
          backgroundColor: '#87747A',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          paddingBottom: '0.5rem',
        }}
      >
        <IconButton
          sx={{
            bgcolor: matBlack,
            color: "white",
            ":hover": {
              bgcolor: "rgba(0,0,0,0.7)",
            },
          }}
          onClick={navigateBack}
        >
          <KeyboardBackspaceIcon />
        </IconButton>

        <Typography variant="h6" color="white">
          Chats
        </Typography>
      </Box>

      {/* Chat Items */}
      {chats?.map((data, index) => {
        const { avatar, _id, name, groupChat, members } = data;
        const newMessageAlert = newMessagesAlert.find(({ chatId }) => chatId === _id);
        const isOnline = members?.some((member) => onlineUsers.includes(member));

        return (
          <ChatItem
            index={index}
            newMessageAlert={newMessageAlert}
            isOnline={isOnline}
            avatar={avatar}
            name={name}
            groupChat={groupChat}
            _id={_id}
            key={_id}
            sameSender={chatId === _id}
            handleDeleteChat={handleDeleteChat}
            styling={{
              padding: '0.75rem 1rem',
              backgroundColor: groupChat ? '#ffffff' : '#f9f9f9',
              borderRadius: '8px',
              boxShadow: groupChat ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
              overflow: 'hidden',
              position: 'relative',
            }}
          />
        );
      })}
    </Stack>
  );
};

export default ChatList;
