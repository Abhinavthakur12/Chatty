import React, { memo } from 'react';
import {
  Dialog,
  DialogTitle,
  Stack,
  Typography,
  Avatar,
  Button,
  ListItem,
  Skeleton,
  useTheme,
  alpha,
  DialogContent
} from '@mui/material';
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '../../redux/api/api';
import { useAsyncMutation, useErrors } from '../../hooks/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { setIsNotification } from '../../redux/reducers/misc';
import { motion } from 'framer-motion';

const Notifications = () => {
  const theme = useTheme();
  const { isNotification } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const { isLoading, data, error, isError } = useGetNotificationsQuery();
  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);

  const FriendRequesthandler = async ({ _id, accept }) => {
    dispatch(setIsNotification(false));
    await acceptRequest(accept ? "Accepting friend request..." : "Rejecting friend request...", { 
      requestId: _id, 
      accept 
    });
  };

  useErrors([{ error, isError }]);

  const handleClose = () => {
    dispatch(setIsNotification(false));
  };

  return (
    <Dialog 
      open={isNotification} 
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper'
        }
      }}
    >
      <DialogTitle 
        sx={{
          fontWeight: 700,
          p: 3,
          color: 'text.primary',
          fontSize: '1.25rem',
          borderBottom: `1px solid ${theme.palette.divider}`,
          textAlign: 'center'
        }}
      >
        Notifications
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0, flex: 1, overflowY: 'auto' }}>
        {isLoading ? (
          <Stack spacing={1} p={3}>
            {[1, 2, 3].map((i) => (
              <Skeleton 
                key={i} 
                variant="rounded" 
                width="100%" 
                height={72} 
                sx={{ borderRadius: 2 }}
              />
            ))}
          </Stack>
        ) : (
          <>
            {data?.allRequests?.length > 0 ? (
              <Stack spacing={0}>
                {data.allRequests.map((request, index) => (
                  <motion.div
                    key={request._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <NotificationItem 
                      sender={request.sender} 
                      _id={request._id} 
                      handler={FriendRequesthandler} 
                    />
                  </motion.div>
                ))}
              </Stack>
            ) : (
              <Stack 
                justifyContent="center" 
                alignItems="center" 
                minHeight="100px"
                p={3}
              >
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ textAlign: 'center' }}
                >
                  No notifications available
                </Typography>
              </Stack>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

const NotificationItem = memo(({ sender, _id, handler }) => {
  const theme = useTheme();
  const { name, avatar } = sender;

  return (
    <ListItem 
      sx={{
        p: 2,
        borderBottom: `1px solid ${theme.palette.divider}`,
        '&:last-child': { borderBottom: 'none' },
        transition: 'background-color 0.2s ease',
        '&:hover': {
          bgcolor: alpha(theme.palette.primary.main, 0.05)
        }
      }}
    >
      <Stack 
        direction="row" 
        alignItems="center" 
        spacing={2} 
        width="100%"
      >
        <Avatar 
          src={avatar} 
          sx={{ 
            width: 48, 
            height: 48, 
            boxShadow: theme.shadows[1],
            border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`
          }} 
        />
        
        <Typography
          variant="body1"
          sx={{
            flex: 1,
            fontWeight: 500,
            color: 'text.primary',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {`${name} sent you a friend request`}
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{ flexShrink: 0 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              size="small"
              onClick={() => handler({ _id, accept: true })}
              sx={{
                minWidth: '80px',
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: theme.shadows[1]
                }
              }}
            >
              Accept
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handler({ _id, accept: false })}
              sx={{
                minWidth: '80px',
                fontWeight: 600,
                borderWidth: '2px',
                '&:hover': {
                  borderWidth: '2px'
                }
              }}
            >
              Reject
            </Button>
          </motion.div>
        </Stack>
      </Stack>
    </ListItem>
  );
});

export default Notifications;