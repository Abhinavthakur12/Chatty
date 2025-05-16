import React, { lazy, Suspense } from 'react';
import {
  AppBar,
  Backdrop,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

import { server } from '../../constants/config';
import { useDispatch, useSelector } from 'react-redux';
import { userNotExists } from '../../redux/reducers/auth';
import {
  setIsMobile,
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
} from '../../redux/reducers/misc';
import { resetNotificationCount } from '../../redux/reducers/chat';
import api from '../../redux/api/api';

const SearchDialog = lazy(() => import('../specific/Search'));
const NewGroupDialog = lazy(() => import('../specific/NewGroup'));
const NotificationDialog = lazy(() => import('../specific/Notifications'));

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isSearch, isNotification, isNewGroup } = useSelector(
    (state) => state.misc
  );
  const { notificationCount } = useSelector((state) => state.chat);

  const handleMobile = () => dispatch(setIsMobile(true));
  const openSearch = () => dispatch(setIsSearch(true));
  const openNewGroup = () => dispatch(setIsNewGroup(true));
  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };
  const navigateToGroup = () => navigate('/groups');

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      dispatch(userNotExists());
      dispatch(api.util.resetApiState())
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }} height={"4rem"}>
        <AppBar
          position="static"
          sx={{
            bgcolor: '#121212',
            color: '#fff',
            borderBottom: '1px solid #333',
            boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 'bold' }}
            >
              Chatty
            </Typography>

            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
              <IconButton color="inherit" onClick={handleMobile}>
                <MenuIcon />
              </IconButton>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconBtn title="Search" icon={<SearchIcon />} onClick={openSearch} />
              <IconBtn title="New Group" icon={<AddIcon />} onClick={openNewGroup} />
              <IconBtn
                title="Manage Groups"
                icon={<GroupIcon />}
                onClick={navigateToGroup}
              />
              <IconBtn
                title="Notifications"
                icon={<NotificationsIcon />}
                onClick={openNotification}
                value={notificationCount}
              />
              <IconBtn title="Logout" icon={<LogoutIcon />} onClick={logoutHandler} />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      {isSearch && (
        <Suspense fallback={<Backdrop open sx={{ zIndex: 1301 }} />}>
          <SearchDialog />
        </Suspense>
      )}
      {isNewGroup && (
        <Suspense fallback={<Backdrop open sx={{ zIndex: 1301 }} />}>
          <NewGroupDialog />
        </Suspense>
      )}
      {isNotification && (
        <Suspense fallback={<Backdrop open sx={{ zIndex: 1301 }} />}>
          <NotificationDialog />
        </Suspense>
      )}
    </>
  );
};

const IconBtn = ({ title, icon, onClick, value }) => {
  return (
    <Tooltip title={title}>
      <IconButton
        color="inherit"
        size="large"
        onClick={onClick}
        sx={{
          transition: 'all 0.2s',
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.1)',
            borderRadius: '0.5rem',
          },
        }}
      >
        {value ? (
          <Badge badgeContent={value} color="error">
            {icon}
          </Badge>
        ) : (
          icon
        )}
      </IconButton>
    </Tooltip>
  );
};

export default Header;
