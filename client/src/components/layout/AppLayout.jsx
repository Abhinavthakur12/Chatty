import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Drawer, Grid, Skeleton } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Header from './Header';
import Title from '../shared/Title';
import ChatList from '../specific/ChatList';
import Profile from '../specific/Profile';
import DeleteChatMenu from '../dialogs/DeleteChatMenu';

import { useMyChatsQuery } from '../../redux/api/api';
import { useErrors, useSocketEvents } from '../../hooks/hooks';
import { getOrSaveFromStorage } from '../../lib/features';
import { getSocket } from '../../socket';

import {
  setIsDeleteMenu,
  setIsMobile,
  setSelectedDeleteChat,
} from '../../redux/reducers/misc';
import {
  incrementNotification,
  setNewMessagesAlert,
} from '../../redux/reducers/chat';

import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  ONLINE_USERS,
  REFETCH_CHATS,
} from '../../constants/events';

const AppLayout = (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();
    const { chatId } = useParams();
    const socket = getSocket();
    const dispatch = useDispatch();

    const deleteMenuAnchor = useRef(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    const { isMobile } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);
    const { newMessagesAlert } = useSelector((state) => state.chat);

    const {
      isLoading,
      data,
      isError,
      error,
      refetch,
    } = useMyChatsQuery("");

    useErrors([{ isError, error }]);

    useEffect(() => {
      getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
    }, [newMessagesAlert]);

    const handleDeleteChat = (e, chatId, groupChat) => {
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectedDeleteChat({ chatId, groupChat }));
      deleteMenuAnchor.current = e.currentTarget;
    };

    const handleMobileClose = () => dispatch(setIsMobile(false));

    const newMessageAlertListener = useCallback((data) => {
      if (data.chatId === chatId) return;
      dispatch(setNewMessagesAlert(data));
    }, [chatId]);

    const newRequestListener = useCallback(() => {
      dispatch(incrementNotification());
    }, [dispatch]);

    const refetchListener = useCallback(() => {
      console.log("refetch chat come")
      refetch();
      navigate('/')
    }, [refetch, navigate]);

    const onlineUsersListener = useCallback((data) => {
      setOnlineUsers(data);
    }, []);

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertListener,
      [NEW_REQUEST]: newRequestListener,
      [REFETCH_CHATS]: refetchListener,
      [ONLINE_USERS]: onlineUsersListener,
    };

    useSocketEvents(socket, eventHandlers);

    return (
      <>
        <Title />
        <Header />
        <DeleteChatMenu dispatch={dispatch} deleteMenuAnchor={deleteMenuAnchor} />

        {/* Drawer for mobile chat list */}
        {isLoading ? (
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{ height: '100vh', bgcolor: '#1e1e2f' }}
          />
        ) : (
          <Drawer
            open={isMobile}
            onClose={handleMobileClose}
            PaperProps={{
              sx: {
                width: '80vw',
                background: '#1e1e2f',
                color: '#fff',
                padding: 2,
              },
            }}
          >
            <ChatList
              w="100%"
              chats={data?.chats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
              newMessagesAlert={newMessagesAlert}
              onlineUsers={onlineUsers}
            />
          </Drawer>
        )}

        {/* Main layout */}
        <Grid container height="calc(100vh - 4rem)">
          {/* Sidebar: Chat List */}
          <Grid
            item
            sm={4}
            md={3}
            height="100%"
            sx={{
              display: { xs: 'none', sm: 'block' },
              bgcolor: '#121212',
              color: '#fff',
              borderRight: '1px solid #333',
              overflowY: 'auto',
            }}
          >
            {isLoading ? (
              <Skeleton variant="rectangular" animation="wave" height="100%" />
            ) : (
              <ChatList
                chats={data?.chats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                newMessagesAlert={newMessagesAlert}
                onlineUsers={onlineUsers}
              />
            )}
          </Grid>

          {/* Main Chat Area */}
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            lg={6}
            height="100%"
            sx={{
              bgcolor: '#1a1a2e',
              padding: { xs: 1, sm: 2 },
              overflowY: 'auto',
            }}
          >
            <WrappedComponent {...props} chatId={chatId} user={user} />
          </Grid>

          {/* Profile Sidebar */}
          <Grid
            item
            md={4}
            lg={3}
            height="100%"
            sx={{
              display: { xs: 'none', md: 'block' },
              padding: '2rem',
              backdropFilter: 'blur(10px)',
              background: 'rgba(18, 18, 18, 0.75)',
              color: '#fff',
              borderLeft: '1px solid #333',
            }}
          >
            <Profile user={user} />
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;
