import { useInputValidation } from '6pp';
import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import { sampleUsers } from '../../constants/sampleData';
import UserItem from '../shared/UserItem';
import { useAvailableFriendsQuery, useNewGroupMutation } from '../../redux/api/api';
import { useAsyncMutation, useErrors } from '../../hooks/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { setIsNewGroup } from '../../redux/reducers/misc';
import { toast } from 'react-hot-toast';

const NewGroup = () => {
  const { isError, isLoading, error, data } = useAvailableFriendsQuery();
  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);
  const { isNewGroup } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const [selectedMembers, setSelectedMembers] = useState([]);
  const groupName = useInputValidation("");

  const errors = [
    {
      isError,
      error
    }
  ];
  useErrors(errors);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) => prev.includes(id) ? prev.filter((currElement) => currElement !== id) : [...prev, id]);
  };

  const submitHandler = () => {
    if (!groupName.value) return toast.error("Group name is required");
    if (selectedMembers.length < 2) return toast.error("Group must have at least 3 members");
    newGroup("creating new Group", { name: groupName.value, members: selectedMembers });
    closeHandler();
  };

  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  };

  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
      <Stack p={{ xs: '1rem', sm: '3rem' }} width={'100%'} maxWidth="25rem" spacing={'2rem'} sx={{
        backgroundColor: '#fff',
        borderRadius: '1rem',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}>
        <DialogTitle variant='h4' textAlign={'center'} sx={{
          fontWeight: 'bold',
          color: '#333',
          paddingBottom: '1rem',
        }}>New Group</DialogTitle>

        <TextField
          label="Group Name"
          value={groupName.value}
          onChange={groupName.changeHandler}
          fullWidth
          variant="outlined"
          sx={{
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            padding: '0.5rem',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#ddd',
              },
              '&:hover fieldset': {
                borderColor: '#888',
              },
            },
          }}
        />
        <Typography variant='body1' sx={{
          color: '#444',
          fontWeight: '600',
        }}>Members</Typography>
        <Stack>
          {isLoading ? (<Skeleton variant="rectangular" width="100%" height={60} />) : (
            data?.friends?.map((i) => (
              <UserItem
                user={i}
                key={i._id}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(i._id)}
                styling={{
                  backgroundColor: selectedMembers.includes(i._id) ? '#E3F2FD' : 'transparent',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  marginBottom: '0.5rem',
                }}
              />
            ))
          )}
        </Stack>

        <Stack direction={'row'} justifyContent={'space-between'} sx={{ marginTop: '2rem' }}>
          <Button variant='text' color='error' onClick={closeHandler} sx={{
            fontWeight: '600',
            textTransform: 'none',
          }}>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={submitHandler}
            disabled={isLoadingNewGroup}
            sx={{
              backgroundColor: '#3f51b5',
              color: 'white',
              textTransform: 'none',
              padding: '0.75rem 2rem',
              '&:hover': {
                backgroundColor: '#303f9f',
              },
              '&:disabled': {
                backgroundColor: '#b0bec5',
                color: '#e0e0e0',
              },
            }}
          >
            Create
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroup;
