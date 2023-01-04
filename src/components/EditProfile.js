import { TextField, Typography } from '@mui/material'
import { Box } from '@mui/material'
import React from 'react'
import {Button} from './Button'
import './EditProfile.css'
import avatar from './default.png'

import { useState, useEffect } from "react";
import axios, {isCancel, AxiosError} from 'axios';

import reScale from './func'
import setAvatar from './setAvatar'

function handleSubmit() {
	
  const IDCookie = document
  	.cookie
	.split('; ')
	.find((row) => row.startsWith('user_id='))
	?.split('=')[1];

  axios.post("http://127.0.0.1:5000/profile/EditProfile", {
    userID: IDCookie,
    email: document.getElementById("email").value,
    username: document.getElementById("username").value, 
    password: document.getElementById("password").value,
	newPassword: document.getElementById("newPassword").value
  }).then((response) => { setTimeout(redirect(response.data), 1000)})
    .catch((error) => console.error('[FAIL] :: ' + error))
}

function redirect(response) {
	console.log(response)
	if(response.msg === "User edited successfully") {
		window.location.href = "/Profile"
	}
	else {
		window.alert(response.msg)
	}
}


function Profile() {

	const [data, setData] = useState([])


	avatar = setAvatar(data.avatarUrl);


	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var response = this.responseText;

			let email = /[a-zA-Z0-9]{1,}[@]{1}[a-z0-9]{1,}[.]{1}[a-z0-9]{1,}/.exec(response);
			document.getElementById('email').value = email;

			var res = response.replace(/"/, 'd');
			var res = res.replace(/"/, 'd');
			var res = res.replace(/"/, 'd');
			var res = res.replace(/"/, 'd');
			var res = res.replace(/"/, 'd');
			var res = res.replace(/"/, 'd');
			var begin = res.search(/"/);
			var res = res.replace(/"/, 'd');
			var end = res.search(/"/);
			var username = res.slice(begin + 1, end);

			document.getElementById('username').value = username;
		}
	};

	function handleUploadImage(ev)
	{
		console.log("handled");
	
		let data = new FormData();
		data.append('file',document.getElementById("image").files[0]);
		console.log("=====");
		console.log(data);

		
		
		axios.post('http://localhost:5000/image', data)
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.log(error);
    });
	
	
	}


	var name='user_id',userId;
	var i, c, ca, nameEQ = name + "=";
    ca = document.cookie.split(';');
    for(i=0;i < ca.length;i++) {
        c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1,c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            userId= c.substring(nameEQ.length,c.length);
        }
    }
	let url="http://localhost:5000/profile/get_data/"+userId.toString();

	xhr.open('GET', url, true);
	xhr.send();

	
  return (

    <div>
        <form method="POST" style={{height: reScale()+'px'}}>
            <Box className='sign-up-form2'>
				<img src={avatar} height="150px" width="150px"/>
				<TextField margin='normal' id='username' type={'text'} variant='outlined' placeholder='Nick' value={data.nick}/>
                <TextField margin='normal' id='email' type={'email'} variant='outlined' placeholder='Email' value={data.email}/>
				<TextField margin='normal' id='newPassword' type={'password'} variant='outlined' placeholder='New password'/>
				<TextField margin='normal' id='password' type={'password'} variant='outlined' placeholder='Password (required)'/>
				<div>
				<input type="file" name="file" id='image' onChange={handleUploadImage} />
				</div>
				<Button onClick={handleSubmit} buttonStyle='btn--2' buttonSize="btn--medium">Save changes</Button>
            </Box>
       </form>
    </div>
  )
}

export default Profile