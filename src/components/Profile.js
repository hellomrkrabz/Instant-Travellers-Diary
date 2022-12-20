import { TextField, Typography } from '@mui/material'
import { Box } from '@mui/material'
import React from 'react'
import {Button} from './Button'
import './Profile.css'
import avatar from './default.png'

import { useState, useEffect } from "react";
import axios, {isCancel, AxiosError} from 'axios';

import reScale from './func'
import setAvatar from './setAvatar'

function Profile() {
	
	const [data, setData] = useState([])
	
  useEffect(() => {
    axios.get("/api/test")
      .then((response) => {
        console.log(response)
        const data = response.data
        console.log(data)
        setData(data)
      })
      .catch(error => {
        alert(error)
      })
  }, [])	
  
  avatar=setAvatar(data.avatarUrl);
  var red='#eb3449';
	
  return (
    <div>
        <form method="POST" style={{height: reScale()+'px'}}>
            <Box className='sign-up-form2'>
                <Typography className='typography' variant='h2'>Your profile!</Typography>
				<img src={avatar} height="150px" width="150px"/>
				<TextField margin='normal' type={'text'} variant='outlined' placeholder='Nick' value={data.nick}/>
                <TextField margin='normal' type={'email'} variant='outlined' placeholder='Email' value={data.email}/>
				<Button buttonStyle='btn--2' buttonSize="btn--medium"  path="/EditProfile">Edit profile</Button>
            </Box>
        </form>
    </div>
  )
}

export default Profile