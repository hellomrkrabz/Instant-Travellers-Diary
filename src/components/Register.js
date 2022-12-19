import { TextField, Typography } from '@mui/material'
import { Box, Button } from '@mui/material'
import React from 'react'
//import { Button } from './Button'
import './Register.css'

function Register() {
  return (
    <div>
        <form method="POST">
            <Box className='sign-up-form'>
                <Typography className='typography' variant='h2'>Sign-up</Typography>
                <TextField margin='normal' type={'email'} variant='outlined' placeholder='Email'/>
                <TextField margin='normal' type={'text'} variant='outlined' placeholder='Username'/>
                <TextField margin='normal' type={'password'} variant='outlined'placeholder='Password'/>
                <Button variant='contained' color='warning' style={{
								backgroundColor: "#e64381",
							}}>Sign-up</Button>
            </Box>
        </form>
    </div>
  )
}

export default Register