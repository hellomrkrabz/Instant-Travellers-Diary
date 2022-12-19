import { TextField, Typography } from '@mui/material'
import { Box, Button } from '@mui/material'
import React from 'react'
//import { Button } from './Button'
import './Login.css'

function Login() {
  return (
    <div>
        <form method="POST">
            <Box className='sign-up-form'>
                <Typography className='typography' variant='h2'>Your profile!</Typography>
                <TextField margin='normal' type={'email'} variant='outlined' placeholder='Email'/>
                <TextField margin='normal' type={'password'} variant='outlined'placeholder='Password'/>
                <Button variant='contained' color='warning' style={{
								backgroundColor: "#e64381",
							}}>Login</Button>
            </Box>
        </form>
    </div>
  )
}

export default Login