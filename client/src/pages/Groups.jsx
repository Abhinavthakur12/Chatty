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
  Typography,
  useTheme,
  alpha
} from '@mui/material';
import React, { lazy, memo, Suspense, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Link } from '../components/styles/StyledComponents';
import AvatarCard from '../components/shared/AvatarCard';
import { useAddGroupMembersMutation, useChatDetailsQuery, useDeleteChatMutation, useMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupMutation } from '../redux/api/api';
import { useAsyncMutation, useErrors } from '../hooks/hooks';
import { LayoutLoader } from '../components/layout/Loaders';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAddMember } from '../redux/reducers/misc';
import UserItem from '../components/shared/UserItem';
import { motion } from 'framer-motion';

const ConfirmDeleteDialog = lazy(() => import('../components/dialogs/ConfirmDeleteDialog'));
const AddMemberDialog = lazy(() => import('../components/dialogs/AddMemberDialog'));

const Groups = () => {
  const theme = useTheme();
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
    <Stack 
      direction="row" 
      alignItems="center" 
      justifyContent="center" 
      spacing={2} 
      mt={4} 
      mb={2}
    >
      {isEdit ? (
        <>
          <TextField
            value={groupNameUpdatedValue}
            onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />
          <IconButton 
            onClick={updateGroupName} 
            disabled={isLoadingGroupName}
            sx={{ color: theme.palette.success.main }}
          >
            <DoneIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Typography 
            variant="h4" 
            fontWeight={600}
            sx={{ 
              color: 'text.primary',
              textAlign: 'center'
            }}
          >
            {groupName}
          </Typography>
          <IconButton 
            onClick={() => setIsEdit(true)} 
            disabled={isLoadingGroupName}
            sx={{ color: theme.palette.primary.main }}
          >
            <EditIcon />
          </IconButton>
        </>
      )}
    </Stack>
  );

  return myGroups.isLoading ? <LayoutLoader /> : (
    <Grid container height="100vh">
      {/* Desktop Group List */}
      <Grid item sm={4} sx={{ display: { xs: 'none', sm: 'block' } }}>
        <GroupList myGroups={myGroups?.data?.groups} chatId={chatId} />
      </Grid>

      {/* Main Content */}
      <Grid 
        item 
        xs={12} 
        sm={8} 
        sx={{ 
          px: { xs: 2, sm: 4 }, 
          py: 3, 
          position: 'relative',
          bgcolor: 'background.default'
        }}
      >
        {/* Navigation Buttons */}
        <Stack direction="row" justifyContent="space-between" mb={2}>
          <Tooltip title="Back">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <IconButton
                onClick={navigateBack}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
              >
                <KeyboardBackspaceIcon />
              </IconButton>
            </motion.div>
          </Tooltip>

          <IconButton
            onClick={handleMobile}
            sx={{ 
              display: { xs: 'block', sm: 'none' },
              color: 'text.primary'
            }}
          >
            <MenuIcon />
          </IconButton>
        </Stack>

        {groupName && (
          <Box>
            {GroupName}
            
            <Typography 
              variant="h6" 
              mb={2}
              sx={{ 
                color: 'text.primary',
                fontWeight: 500
              }}
            >
              Members
            </Typography>

            <Stack
              spacing={2}
              sx={{
                maxHeight: '50vh',
                overflowY: 'auto',
                px: 1,
                mb: 4,
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.5),
                  borderRadius: '3px',
                },
              }}
            >
              {isLoadingDeleteGroup ? (
                <CircularProgress />
              ) : (
                members.map((member) => (
                  <motion.div
                    key={member._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring" }}
                  >
                    <UserItem
                      user={member}
                      isAdded
                      styling={{
                        boxShadow: theme.shadows[1],
                        padding: "1rem 2rem",
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.background.paper, 0.8),
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                        }
                      }}
                      handler={removeMemberHandler}
                    />
                  </motion.div>
                ))
              )}
            </Stack>

            <Stack 
              direction={{ xs: "column", sm: "row" }} 
              spacing={2} 
              justifyContent="center"
              sx={{ mt: 4 }}
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  size="large"
                  color="error"
                  variant="contained"
                  startIcon={<DeleteIcon />}
                  onClick={openConfirmDeleteHandler}
                  sx={{
                    fontWeight: 600,
                    px: 3,
                    borderRadius: 2
                  }}
                >
                  Delete Group
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  size="large"
                  variant="contained"
                  color="success"
                  startIcon={<AddIcon />}
                  onClick={openAddMemberHandler}
                  sx={{
                    fontWeight: 600,
                    px: 3,
                    borderRadius: 2
                  }}
                >
                  Add Member
                </Button>
              </motion.div>
            </Stack>
          </Box>
        )}
      </Grid>

      {/* Dialogs */}
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

      {/* Mobile Drawer */}
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

const GroupList = ({ w = "100%", myGroups = [], chatId }) => {
  const theme = useTheme();
  
  return (
    <Stack
      width={w}
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        height: "100vh",
        overflowY: "auto",
        px: 2,
        py: 3
      }}
    >
      {myGroups.length > 0 ? (
        myGroups.map((group, index) => (
          <motion.div
            key={group._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GroupListItem group={group} chatId={chatId} />
          </motion.div>
        ))
      ) : (
        <Typography 
          textAlign="center" 
          py={2}
          sx={{ color: 'white' }}
        >
          No groups found
        </Typography>
      )}
    </Stack>
  );
};

const GroupListItem = memo(({ group, chatId }) => {
  const theme = useTheme();
  const { name, avatar, _id } = group;
  
  return (
    <Link to={`?group=${_id}`}>
      <motion.div whileHover={{ scale: 1.02 }}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{
            p: 2,
            mb: 1,
            borderRadius: 2,
            bgcolor: chatId === _id ? alpha(theme.palette.common.white, 0.2) : 'transparent',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: alpha(theme.palette.common.white, 0.1),
              cursor: 'pointer',
            }
          }}
        >
          <AvatarCard avatar={avatar} />
          <Typography 
            variant="subtitle1" 
            fontWeight={500}
            sx={{ color: 'white' }}
          >
            {name}
          </Typography>
        </Stack>
      </motion.div>
    </Link>
  );
});

export default Groups;