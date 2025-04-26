import React, { memo } from 'react'
import {
  Dialog,
  DialogTitle,
  Stack,
  Typography,
  Avatar, 
  Button,
  ListItem,
  Skeleton,
} from '@mui/material'
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '../../redux/api/api'
import { useAsyncMutation, useErrors } from '../../hooks/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { setIsNotification } from '../../redux/reducers/misc'

const Notifications = () => {
  const { isNotification } = useSelector((state) => state.misc)
  const dispatch = useDispatch()
  const { isLoading, data, error, isError } = useGetNotificationsQuery()
  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation)

  const FriendRequesthandler = async ({ _id, accept }) => {
    dispatch(setIsNotification(false))
    await acceptRequest("Accepting", { requestId: _id, accept })
  }

  useErrors([{ error, isError }])

  const handleClose = () => {
    dispatch(setIsNotification(false))
  }

  return (
    <Dialog open={isNotification} onClose={handleClose}>
      <Stack p={{ xs: '1rem', sm: '2rem' }} maxWidth={'25rem'} sx={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      }}>
        <DialogTitle variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' }}>Notifications</DialogTitle>
        
        {isLoading ? (<Skeleton variant="rectangular" width="100%" height={60} />) : (
          <>
            {data?.allRequests?.length > 0 ? (
              data?.allRequests?.map((i) => (
                <NotificationItem sender={i.sender} _id={i._id} handler={FriendRequesthandler} key={i._id} />
              ))
            ) : (
              <Typography textAlign={'center'} sx={{ color: 'gray' }}>No Notifications</Typography>
            )}
          </>
        )}
      </Stack>
    </Dialog>
  )
}

const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender

  return (
    <ListItem sx={{
      display: 'flex',
      alignItems: 'center',
      padding: '1rem',
      borderBottom: '1px solid #e0e0e0',
      '&:last-child': {
        borderBottom: 'none',
      },
    }}>
      <Stack direction={'row'} alignItems={'center'} spacing={'1rem'} width={'100%'}>
        <Avatar src={avatar} sx={{ width: 40, height: 40, borderRadius: '50%' }} />
        
        <Typography
          sx={{
            flexGrow: 1,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%',
            fontWeight: 500,
            color: '#333',
          }}
        >
          {`${name} sent you a friend request`}
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
        >
          <Button
            onClick={() => handler({ _id, accept: true })}
            sx={{
              backgroundColor: '#3f51b5',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#303f9f',
              },
            }}
          >
            Accept
          </Button>
          <Button
            color="error"
            onClick={() => handler({ _id, accept: false })}
            sx={{
              '&:hover': {
                backgroundColor: '#f44336',
              },
            }}
          >
            Reject
          </Button>
        </Stack>
      </Stack>
    </ListItem>
  )
})

export default Notifications
