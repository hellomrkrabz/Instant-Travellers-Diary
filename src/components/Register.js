import { TextField, Typography } from '@mui/material'
import { Box, Button } from '@mui/material'
import React from 'react'
//import { Button } from './Button'
import './Register.css'
import axios, {isCancel, AxiosError} from 'axios';
import { TimesOneMobiledataRounded } from '@mui/icons-material';


function handleSubmit() {
  axios.post("http://127.0.0.1:5000/Register", {
    email: "test_hehe@g.pl", 
    username: "test_hehe", 
    password: "test"
  }).then((response) => { console.log("SUCCESS") })
    .catch((error) => console.error('[FAIL] :: ' + error))
}

function Register() {
  return (
    <div>
        <form method="POST" onSubmit={handleSubmit}>
            <Box className='sign-up-form'>
                <Typography className='typography' variant='h2'>Sign-up</Typography>
                <TextField margin='normal' name='email' type={'email'} variant='outlined' placeholder='Email'/>
                <TextField margin='normal' name='username' type={'text'} variant='outlined' placeholder='Username'/>
                <TextField margin='normal' name='password' type={'password'} variant='outlined'placeholder='Password'/>
                <button type="button" onClick={handleSubmit}>Submit button 1</button>
                <Button variant='contained' color='warning' style={{
								  backgroundColor: "#e64381",
							  }}>Sign-up button 2</Button>
            </Box>
        </form>
    </div>
  )
}

export default Register