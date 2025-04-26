import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Edit as EditIcon,
  KeyboardBackspace as KeyboardBackspaceIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Drawer,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import React, { lazy, memo, Suspense, useEffect, useState } from 'react';
import { bgGradient, matBlack } from '../constants/color';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Link } from '../components/styles/StyledComponents';
import AvatarCard from '../components/shared/AvatarCard';
import { useAddGroupMembersMutation, useChatDetailsQuery, useDeleteChatMutation, useMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupMutation } from '../redux/api/api';
import { useAsyncMutation, useErrors } from '../hooks/hooks';
import { LayoutLoader } from '../components/layout/Loaders';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAddMember } from '../redux/reducers/misc';
import UserItem from '../components/shared/UserItem';

const ConfirmDeleteDialog = lazy(() => import('../components/dialogs/ConfirmDeleteDialog'));
const AddMemberDialog = lazy(() => import('../components/dialogs/AddMemberDialog'));

const Groups = () => {
  const chatId = useSearchParams()[0].get("group");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAddMember } = useSelector((state) => state.misc);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState('');
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [members, setMembers] = useState([]);

  const myGroups = useMyGroupsQuery();
  const groupDetails = useChatDetailsQuery({ chatId, populate: true }, { skip: !chatId });

  const [updateGroup, isLoadingGroupName] = useAsyncMutation(useRenameGroupMutation);
  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(useRemoveGroupMemberMutation);
  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(useDeleteChatMutation);

  useErrors([
    { isError: myGroups.isError, error: myGroups.error },
    { isError: groupDetails.isError, error: groupDetails.error }
  ]);

  useEffect(() => {
    if (groupDetails.data) {
      const { chat } = groupDetails.data;
      setGroupName(chat.name);
      setGroupNameUpdatedValue(chat.name);
      setMembers(chat.members);
    }

    return () => {
      setGroupName('');
      setGroupNameUpdatedValue('');
      setMembers([]);
      setIsEdit(false);
    };
  }, [groupDetails.data]);

  const handleMobile = () => setIsMobileMenuOpen((prev) => !prev);
  const handleMobileClose = () => setIsMobileMenuOpen(false);
  const navigateBack = () => navigate('/');

  const updateGroupName = () => {
    setIsEdit(false);
    updateGroup("Updating Group Name...", { chatId, name: groupNameUpdatedValue });
  };

  const openConfirmDeleteHandler = () => setConfirmDeleteDialog(true);
  const closeConfirmDeleteHandler = () => setConfirmDeleteDialog(false);
  const openAddMemberHandler = () => dispatch(setIsAddMember(true));
  const deleteHandler = () => {
    deleteGroup("Deleting Group...", chatId);
    closeConfirmDeleteHandler();
    navigate("/groups");
  };
  const removeMemberHandler = (userId) => removeMember("Removing Member...", { chatId, userId });

  const GroupName = (
    <Stack direction="row" alignItems="center" justifyContent="center" spacing="1rem" mt="2rem" mb="1rem">
      {isEdit ? (
        <>
          <TextField
            value={groupNameUpdatedValue}
            onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
          />
          <IconButton onClick={updateGroupName} disabled={isLoadingGroupName}>
            <DoneIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Typography variant="h4" fontWeight="bold">{groupName}</Typography>
          <IconButton onClick={() => setIsEdit(true)} disabled={isLoadingGroupName}>
            <EditIcon />
          </IconButton>
        </>
      )}
    </Stack>
  );

  return myGroups.isLoading ? <LayoutLoader /> : (
    <Grid container height="100vh">
      <Grid item sx={{ display: { xs: 'none', sm: 'block' } }} sm={4}>
        <GroupList myGroups={myGroups?.data?.groups} chatId={chatId} />
      </Grid>

      <Grid item xs={12} sm={8} sx={{ px: { xs: 2, sm: 6 }, py: 3, position: 'relative' }}>
        {/* Top Left Icons */}
        <Tooltip title="Back">
          <IconButton
            sx={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              bgcolor: matBlack,
              color: 'white',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
            }}
            onClick={navigateBack}
          >
            <KeyboardBackspaceIcon />
          </IconButton>
        </Tooltip>

        <IconButton
          onClick={handleMobile}
          sx={{ position: 'absolute', top: '1rem', right: '1rem', display: { xs: 'block', sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {groupName && (
          <>
            {GroupName}
            <Typography variant="h6" mb={2}>Members</Typography>

            <Stack
              spacing={2}
              sx={{
                maxHeight: '50vh',
                overflowY: 'auto',
                px: 1,
                mb: 4,
                scrollbarWidth: 'thin'
              }}
            >
              {isLoadingDeleteGroup ? (
                <CircularProgress />
              ) : (
                members.map((member) => (
                  <UserItem
                    key={member._id}
                    user={member}
                    isAdded
                    styling={{
                      boxShadow: "0 0 0.5rem rgba(0,0,0,0.1)",
                      padding: "1rem 2rem",
                      borderRadius: "1rem"
                    }}
                    handler={removeMemberHandler}
                  />
                ))
              )}
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
              <Button
                size="large"
                color="error"
                variant="contained"
                startIcon={<DeleteIcon />}
                onClick={openConfirmDeleteHandler}
              >
                Delete Group
              </Button>
              <Button
                size="large"
                variant="contained"
                color="success"
                startIcon={<AddIcon />}
                onClick={openAddMemberHandler}
              >
                Add Member
              </Button>
            </Stack>
          </>
        )}
      </Grid>

      {isAddMember && (
        <Suspense fallback={<Backdrop open />}>
          <AddMemberDialog chatId={chatId} />
        </Suspense>
      )}

      {confirmDeleteDialog && (
        <Suspense fallback={<Backdrop open />}>
          <ConfirmDeleteDialog
            open={confirmDeleteDialog}
            handleClose={closeConfirmDeleteHandler}
            deleteHandler={deleteHandler}
          />
        </Suspense>
      )}

      <Drawer
        open={isMobileMenuOpen}
        onClose={handleMobileClose}
        sx={{ display: { xs: 'block', sm: 'none' } }}
      >
        <GroupList myGroups={myGroups?.data?.groups} chatId={chatId} w="75vw" />
      </Drawer>
    </Grid>
  );
};

const GroupList = ({ w = "100%", myGroups = [], chatId }) => (
  <Stack
    width={w}
    sx={{
      backgroundColor: "#D37B61",
      height: "100vh",
      overflowY: "auto",
      px: 2,
      py: 3
    }}
  >
    {myGroups.length > 0 ? (
      myGroups.map((group) => <GroupListItem group={group} chatId={chatId} key={group._id} />)
    ) : (
      <Typography textAlign="center" py={2}>No groups found</Typography>
    )}
  </Stack>
);

const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;
  return (
    <Link to={`?group=${_id}`}>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{
          borderRadius: 2,
          bgcolor: chatId === _id ? 'rgba(255,255,255,0.2)' : 'transparent',
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.1)',
            cursor: 'pointer',
          }
        }}
      >
        <AvatarCard avatar={avatar} />
        <Typography variant="subtitle1" fontWeight={500}>{name}</Typography>
      </Stack>
    </Link>
  );
});

export default Groups;
