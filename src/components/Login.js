import { TextField, Typography } from '@mui/material'
import { Box, Button } from '@mui/material'
import React from 'react'
import './Login.css'
import axios, { isCancel, AxiosError } from 'axios';

function handleSubmit()
{
	axios.post("http://127.0.0.1:5000/Login",
		{
			username: document.getElementById("username").value,
			password: document.getElementById("password").value
		}).then((response) =>
		{
			setTimeout(redirect(response.data), 1000)
		})
		.catch((error) => console.error('[FAIL] :: ' + error))
}

function redirect(response)
{
	var days = 2;
	var name = 'user_id';
	var date, expires;
	if(days)
	{
		date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toGMTString();
	}
	else
	{
		expires = "";
	}
	document.cookie = name + "=" + response.user_id + expires + "; path=/";

	if(response.msg === "success")
	{
		window.location.href = "/Profile"
	}
	else
	{
		window.alert(response.msg)
	}
}

function Login()
{
	return ( 
	<div>
		<form method = "POST" >
			<Box className = 'sign-up-form' >
				<Typography className = 'typography' variant = 'h2' > Login < /Typography> 
				<TextField margin = 'normal' 	id = "username" type = { 'username' } variant = 'outlined' placeholder = 'Username' />
				<TextField margin = 'normal' id = "password" 	type = { 'password' } variant = 'outlined' placeholder = 'Password' />
				
				<Button onClick = { handleSubmit } variant = 'contained' color = 'warning' style = { { 	backgroundColor: "#e64381", } } > Login < /Button> 
			</Box> 
		</form> 
	</div>
	)
}

export default Login