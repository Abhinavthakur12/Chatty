import React from 'react'
import { Avatar, Stack, Typography, Box } from '@mui/material'
import {
  Face as FaceIcon,
  AlternateEmail as UserNameIcon,
  CalendarMonth as CalenderIcon
} from '@mui/icons-material'
import moment from 'moment'
import { transformImage } from '../../lib/features'

const Profile = ({ user }) => {
  return (
    <Stack direction={'column'} spacing={"2rem"} alignItems={'center'}>
      <Avatar
        src={transformImage(user?.avatar?.url)}
        sx={{
          width: 150,
          height: 150,
          objectFit: "contain",
          marginBottom: '1rem',
          border: "5px solid #ffffff",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)"
        }}
      />
      
      <ProfileCard heading={"Bio"} text={user?.bio} />
      <ProfileCard heading={"Username"} text={user?.username} icon={<UserNameIcon />} />
      <ProfileCard heading={"Name"} text={user?.name} icon={<FaceIcon />} />
      <ProfileCard 
        heading={"Joined"} 
        text={moment(user?.createdAt).fromNow()} 
        icon={<CalenderIcon />} 
      />
    </Stack>
  )
}

const ProfileCard = ({ text, icon, heading }) => (
  <Box 
    sx={{
      backgroundColor: '#f5f5f5', 
      borderRadius: '8px', 
      padding: '1rem', 
      width: '100%', 
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
    }}
  >
    <Stack direction={'row'} alignItems={'center'} spacing={"1rem"}>
      {icon && <Box sx={{ color: '#3f51b5', fontSize: '1.5rem' }}>{icon}</Box>}
      <Stack>
        <Typography variant='body1' sx={{ fontWeight: 600, color: '#333' }}>
          {text}
        </Typography>
        <Typography variant='caption' color={'gray'}>
          {heading}
        </Typography>
      </Stack>
    </Stack>
  </Box>
)

export default Profile
