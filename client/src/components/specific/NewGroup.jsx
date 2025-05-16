import { useInputValidation } from '6pp';
import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useTheme,
  alpha,
  DialogContent
} from '@mui/material';
import React, { useState } from 'react';
import { useAvailableFriendsQuery, useNewGroupMutation } from '../../redux/api/api';
import { useAsyncMutation, useErrors } from '../../hooks/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { setIsNewGroup } from '../../redux/reducers/misc';
import { toast } from 'react-hot-toast';
import UserItem from '../shared/UserItem';

const NewGroup = () => {
  const theme = useTheme();
  const { isError, isLoading, error, data } = useAvailableFriendsQuery();
  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);
  const { isNewGroup } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  
  const [selectedMembers, setSelectedMembers] = useState([]);
  const groupName = useInputValidation("");

  const errors = [{ isError, error }];
  useErrors(errors);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) => 
      prev.includes(id) 
        ? prev.filter((currElement) => currElement !== id) 
        : [...prev, id]
    );
  };

  const submitHandler = () => {
    if (!groupName.value) return toast.error("Group name is required");
    if (selectedMembers.length < 2) return toast.error("Group must have at least 3 members");
    newGroup("Creating new group...", { 
      name: groupName.value, 
      members: selectedMembers 
    });
    closeHandler();
  };

  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
    setSelectedMembers([]);
    groupName.setValue("");
  };

  return (
    <Dialog 
      open={isNewGroup} 
      onClose={closeHandler}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <DialogTitle 
        sx={{
          fontWeight: 700,
          p: 3,
          color: theme.palette.text.primary,
          fontSize: '1.5rem',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        Create New Group
      </DialogTitle>

      {/* Non-scrollable section */}
      <Stack spacing={3} p={3} sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
        <TextField
          label="Group Name"
          value={groupName.value}
          onChange={groupName.changeHandler}
          fullWidth
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '& fieldset': {
                borderColor: theme.palette.divider,
              },
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
                boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
              },
            },
          }}
        />

        <Typography 
          variant='subtitle1'
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 600,
          }}
        >
          Select Members
        </Typography>
      </Stack>

      {/* Scrollable members list */}
      <DialogContent dividers sx={{ p: 0, flex: 1, overflowY: 'auto' }}>
        <Stack spacing={1} p={3}>
          {isLoading ? (
            <Stack spacing={1}>
              {[1, 2, 3].map((i) => (
                <Skeleton 
                  key={i} 
                  variant="rounded" 
                  width="100%" 
                  height={68} 
                  sx={{ borderRadius: 2 }}
                />
              ))}
            </Stack>
          ) : (
            data?.friends?.map((user) => (
              <UserItem
                key={user._id}
                user={user}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(user._id)}
                styling={{
                  backgroundColor: selectedMembers.includes(user._id) 
                    ? alpha(theme.palette.primary.main, 0.1)
                    : 'transparent',
                  borderRadius: 2,
                  p: 1.5,
                  transition: 'all 0.2s ease',
                  border: `1px solid ${selectedMembers.includes(user._id) 
                    ? theme.palette.primary.main 
                    : theme.palette.divider}`,
                }}
              />
            ))
          )}
        </Stack>
      </DialogContent>

      {/* Fixed footer */}
      <Stack 
        direction='row' 
        justifyContent='flex-end'
        spacing={2}
        sx={{ 
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`
        }}
      >
        <Button
          variant='text'
          onClick={closeHandler}
          sx={{
            fontWeight: 600,
            color: theme.palette.text.secondary,
          }}
        >
          Cancel
        </Button>
        <Button
          variant='contained'
          onClick={submitHandler}
          disabled={isLoadingNewGroup}
          sx={{
            fontWeight: 600,
            px: 3,
            py: 1,
            borderRadius: 2,
          }}
        >
          {isLoadingNewGroup ? 'Creating...' : 'Create Group'}
        </Button>
      </Stack>
    </Dialog>
  );
};

export default NewGroup;