import React, { useEffect, useState } from 'react'
import { useInputValidation } from '6pp'
import { Dialog, DialogTitle, InputAdornment, List, Stack, TextField, Box } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import UserItem from '../shared/UserItem'
import { useDispatch, useSelector } from 'react-redux'
import { setIsSearch } from '../../redux/reducers/misc'
import { useLazySearchUserQuery } from '../../redux/api/api'
import { useSendFriendRequestMutation } from '../../redux/api/api'
import { useAsyncMutation } from '../../hooks/hooks'
import { toast } from 'react-hot-toast'

const Search = () => {
  const search = useInputValidation("")
  const { isSearch } = useSelector((state) => state.misc)
  const [searchUser] = useLazySearchUserQuery()
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const [sendFriendRequest, isLoadingFriendRequest] = useAsyncMutation(useSendFriendRequestMutation)

  const addFriendHandler = async (id) => {
    await sendFriendRequest("Sending Friend Request", { userId: id })
  }

  const searchCloseHandler = () => {
    dispatch(setIsSearch(false))
  }

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchUser(search.value).then(({ data }) => setUsers(data.users))
        .catch((err) => console.log(err))
    }, 1000)
  
    return () => {
      clearTimeout(timeOutId)
    }
  }, [search.value])

  return (
    <Dialog open={isSearch} onClose={searchCloseHandler} sx={{ zIndex: 1300 }}>
      <Stack
        p={{ xs: '1rem', sm: '2rem' }}
        direction={'column'}
        width={{ xs: '100%', sm: '25rem' }}
        spacing={2}
        sx={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <DialogTitle textAlign={'center'} sx={{ fontWeight: 600, color: '#333' }}>
          Find People
        </DialogTitle>
        
        <TextField
          label="Search Users"
          value={search.value}
          onChange={search.changeHandler}
          variant='outlined'
          size='small'
          sx={{
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon sx={{ color: '#3f51b5' }} />
              </InputAdornment>
            ),
          }}
        />
        
        <Box sx={{ maxHeight: '400px', overflowY: 'auto', marginTop: '1rem' }}>
          <List>
            {users.map((i) => (
              <UserItem
                user={i}
                key={i._id}
                handler={addFriendHandler}
                handlerIsLoading={isLoadingFriendRequest}
              />
            ))}
          </List>
        </Box>
      </Stack>
    </Dialog>
  )
}

export default Search
