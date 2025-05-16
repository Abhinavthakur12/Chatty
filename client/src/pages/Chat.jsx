import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { IconButton, Skeleton, Stack,Box } from '@mui/material';
import { grayColor, orange } from '../constants/color';
import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material';
import { InputBox } from '../components/styles/StyledComponents';
import FileMenu from '../components/dialogs/FileMenu';
import { sampleMessages } from '../constants/sampleData';
import MessageComponent from '../components/shared/MessageComponent';
import { getSocket } from '../socket';
import { ALERT, CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, START_TYPING, STOP_TYPING } from '../constants/events';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import { useErrors, useSocketEvents } from '../hooks/hooks';
import { useInfiniteScrollTop } from "6pp";
import { useDispatch } from 'react-redux';
import { setIsFileMenu } from '../redux/reducers/misc';
import { removeNewMessagesAlert } from '../redux/reducers/chat';
import { TypingLoader } from '../components/layout/Loaders';
import { useNavigate } from 'react-router-dom';

const Chat = ({ chatId, user }) => {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const socket = getSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);
  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  const members = chatDetails?.data?.chat?.members;

  const messageOnChange = (e) => {
    setMessage(e.target.value);
    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, 2000);
  };

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!message.trim() || !members) return;
    socket.emit(NEW_MESSAGE, {
      chatId,
      members,
      message,
    });
    setMessage("");
  };

  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));
    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId]);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);


  const newMessagesListener = useCallback((data) => {
    if (data.chatId !== chatId) return;
    setMessages((prev) => [...prev, data.message]);
  }, [chatId]);

  const startTypingListener = useCallback((data) => {
    if (data.chatId !== chatId) return;
    setUserTyping(true);
  }, [chatId]);

  const stopTypingListener = useCallback((data) => {
    if (data.chatId !== chatId) return;
    setUserTyping(false);
  }, [chatId]);

  const alertListener = useCallback((data) => {
    if (data.chatId !== chatId) return;
    const messageForAlert = {
      content: data.message,
      sender: {
        _id: "admin_id",
        name: "Admin",
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, messageForAlert]);
  }, [chatId]);

  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };

  useSocketEvents(socket, eventHandler);
  useErrors(errors);

  const allMessages = [...oldMessages, ...messages];

  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <Fragment>
      <Box padding={"1rem"} height={"100%"} display="flex" flexDirection="column" gap="1rem">
        <Stack
          ref={containerRef}
          boxSizing={"border-box"}
          padding={"1rem"}
          spacing={"1rem"}
          bgcolor={grayColor}
          height={"90%"}
          sx={{
            overflowX: "hidden",
            overflowY: "auto",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          {allMessages.map((i) => (
            <MessageComponent key={i._id} message={i} user={user} />
          ))}
          {userTyping && <TypingLoader />}
          <div ref={bottomRef} />
        </Stack>
  
        <form style={{ height: "10%" }} onSubmit={submitHandler}>
          <Stack
            direction={"row"}
            height={"100%"}
            padding={"1rem"}
            alignItems={"center"}
            position={"relative"}
          >
            <IconButton
              sx={{
                position: "absolute",
                left: "1.5rem",
                rotate: "30deg",
                color: orange,
                "&:hover": {
                  bgcolor: "rgba(252, 122, 83, 0.2)",
                },
              }}
              onClick={handleFileOpen}
            >
              <AttachFileIcon/>
            </IconButton>
            <InputBox
              placeholder="Type Message Here..."
              value={message}
              onChange={messageOnChange}
              sx={{
                backgroundColor: "#f5f5f5",
                borderRadius: "20px",
                padding: "1rem 2rem",
                paddingLeft:"3.5rem",
                flexGrow: 1,
                "&:focus": {
                  outline: "none",
                  backgroundColor: "#fff",
                },
              }}
            />
            <IconButton
              type="submit"
              sx={{
                rotate: "-30deg",
                bgcolor: orange,
                color: "white",
                marginLeft: "1rem",
                padding: "0.5rem",
                borderRadius: "50%",
                "&:hover": {
                  bgcolor: "error.dark",
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Stack>
        </form>
      </Box>
      <FileMenu anchorEl={fileMenuAnchor} chatId={chatId} />
    </Fragment>
  );
  
};

export default AppLayout(Chat);
