import { TextField, Typography } from '@mui/material'
import { Box, Button } from '@mui/material'
import React from 'react'
//import { Button } from './Button'
import './Login.css'
import axios, {isCancel, AxiosError} from 'axios';

function handleSubmit() {
  axios.post("http://127.0.0.1:5000/Login", {
    username: document.getElementById("username").value, 
    password: document.getElementById("password").value
  }).then((response) => { setTimeout(redirect(response.data.msg), 1000) })
    .catch((error) => console.error('[FAIL] :: ' + error))
}

function redirect(msg) {
	console.log(msg)
	if(msg === "success") {
		window.location.href = "/Profile"
	}
	else {
		window.alert(msg)
	}
}

function Login() {
  return (
    <div>
        <form method="POST">
            <Box className='sign-up-form'>
                <Typography className='typography' variant='h2'>Login</Typography>
                <TextField margin='normal' id="username" type={'username'} variant='outlined' placeholder='Username'/>
                <TextField margin='normal' id="password" type={'password'} variant='outlined' placeholder='Password'/>
                <Button onClick={handleSubmit} variant='contained' color='warning' style={{
								  backgroundColor: "#e64381",
							  }}>Login</Button>
            </Box>
        </form>
    </div>
  )
}

export default Login