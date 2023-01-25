import { TextField, Typography, Box, Button } from '@mui/material'
import React from 'react'
import './Auth.css'

function Auth() {
  return (
    <div>
        <form>
            <Box className='sign-up-form'>
                <Typography className='typography' variant='h2'>Sign-up</Typography>
                <TextField margin='normal' type={'email'} variant='outlined' placeholder='Email'/>
                <TextField margin='normal' type={'text'} variant='outlined' placeholder='Username'/>
                <TextField margin='normal' type={'password'} variant='outlined'placeholder='Password'/>
                <Button variant='contained' color='warning'>Sign-up</Button>
            </Box>
        </form>
    </div>
  )
}

export default Auth