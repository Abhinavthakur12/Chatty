import {
    Button,
    Container,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import React, { useEffect } from 'react';
import { bgGradient } from "../../constants/color";
import { useInputValidation } from "6pp";
import { Navigate} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin, getAdmin } from "../../redux/thunks/admin";
const AdminLogin = () => {
const dispatch = useDispatch()
const {isAdmin} = useSelector((state)=>state.auth)
const secretKey = useInputValidation("")
const submitHandler = (e)=>{
    e.preventDefault()
    console.log("secret key ke value hai",secretKey.value)
    dispatch(adminLogin(secretKey.value))
}

useEffect(()=>{
  dispatch(getAdmin())
},[dispatch])

if(isAdmin) return <Navigate to="/admin/dashboard" />
  return (
     <div
      style={{backgroundImage: bgGradient}}>
      <Container component={'main'} maxWidth={'xs'} sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <Paper
         elevation={3}
         sx={{
            padding:4,
            display:'flex',
            flexDirection:'column',
            alignItems:'center'
         }}
        >
        <Typography variant={'h5'}>Login</Typography>
        <form style={{width:'100%',marginTop:'1rem'}}
        onSubmit={submitHandler}
        >
             <TextField
            required
            fullWidth
            label='Secret Key'
            type='password'
            margin='normal'
            variant='outlined'
            value={secretKey.value}
            onChange={secretKey.changeHandler}
            />
            <Button sx={{marginTop:"1rem"}} variant='contained' color='primary' type='submit' fullWidth>Login</Button>
        </form>
        </Paper>
      </Container>
    </div>
  )
}

export default AdminLogin