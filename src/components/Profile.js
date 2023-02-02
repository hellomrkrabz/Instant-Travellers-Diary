import { TextField, Typography, TextareaAutosize } from '@mui/material'
import { Box } from '@mui/material'
import React from 'react'
import {Button} from './Button'
import './Profile.css'
import { useState, useEffect } from "react";
import axios, {isCancel, AxiosError} from 'axios';

import reScale from './func'
import setAvatar from './setAvatar'

function Profile() {

	const [data, setData] = useState([])

	var red = '#eb3449';

	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			var response = this.responseText;

			var avatarPath, username, email, bio, sB, sE;
			const obj = JSON.parse(response);

			document.getElementById('username').value = obj.username;
			document.getElementById('email').value = obj.email;
			document.getElementById('bio').value = obj.bio;
			document.getElementById('avatar').src = setAvatar(obj.avatar);
		}
	};

	var name = 'user_id',
		userId;
	var i, c, ca, nameEQ = name + "=";
	ca = document.cookie.split(';');
	for(i = 0; i < ca.length; i++) {
		c = ca[i];
		while(c.charAt(0) == ' ') {
			c = c.substring(1, c.length);
		}
		if(c.indexOf(nameEQ) == 0) {
			userId = c.substring(nameEQ.length, c.length);
		}
	}

	let url = "http://localhost:5000/api/users/" + userId.toString();

	xhr.open('GET', url, true);
	xhr.send();

	return (
    	<div>
        	<form method="POST" style={{height: reScale()+'px'}}>
            	<Box className='sign-up-form3'>
					<div className='sign-up-form2-edit'>
						
						<div className='sign-up-form3-section'>
							<><label>Username</label></>
							<TextField margin='normal' className="textfield" id='username' type={'text'} variant='outlined' placeholder='Nick' value={data.nick} style={{margin: "0px 0px 0px 0px"}}/>
							<><label>Email</label></>
							<TextField margin='normal' id='email' type={'email'} variant='outlined' placeholder='Email' value={data.email} style={{margin: "0px 0px 0px 0px"}}/>
							<><label>Bio</label></>
							<TextField margin='normal' id='bio' type={'text'} variant='outlined' placeholder='Bio' value={data.bio} multiline minRows={3} maxRows={7} style={{margin: "0px 0px 0px 0px"}}/>
						</div>
						<div className='sign-up-form3-section section2'>
							<img id='avatar' height="325px" width="325px"/>
						</div>
					</div>
						<Button buttonStyle='btn--6' buttonSize="btn--medium" path="/EditProfile">Edit Profile</Button>
            	</Box>
       		</form>
    	</div>
  	)
}

export default Profile