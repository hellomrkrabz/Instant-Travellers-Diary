import { TextField, Typography , TextareaAutosize, Box } from '@mui/material'
import React from 'react'
import {Button} from './Button'
import './EditProfile.css'
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
	newPassword: document.getElementById("newPassword").value,
	bio: document.getElementById("bio").value
  }).then((response) => {setTimeout(redirect(response.data), 1000)})
    .catch((error) => console.error('[FAIL] :: ' + error))
}

function redirect(response) {
	if(response.msg === "User edited successfully") {
		window.location.href = "/Profile"
	}
	else {
		window.alert(response.msg)
	}
}


function Profile() {
	const [data, setData] = useState([])	
	
	function handleUploadImage(ev)
	{
        const IDCookie = document
              .cookie
	          .split('; ')
	          .find((row) => row.startsWith('user_id='))?.split('=')[1];

		let data = new FormData();
		data.append('file', document.getElementById("image").files[0]);
        data.append('userID', IDCookie)

		axios.post('http://localhost:5000/api/upload/avatar', data).then(response => {
            console.log(response);
        }).catch(error => {
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
	let url="http://localhost:5000/api/users/"+userId.toString();

	fetch(url).then((response) => response.json()).then((text) => {
			document.getElementById("email").value=text.email;
			document.getElementById("username").value=text.username;
			document.getElementById("bio").value=text.bio;
			document.getElementById("avatar").src=text.avatar;
		}
	);
		
  	return (
    	<div>
        	<form method="POST" style={{height: reScale()+'px'}}>
            	<Box className='sign-up-form2'>
					<div className='sign-up-form2-edit'>
						
						<div className='sign-up-form2-section'>
							<><label>Username</label></>
							<TextField margin='normal' id='username' type={'text'} variant='outlined' placeholder='Nick' value={data.nick} style={{margin: "0px 0px 0px 0px"}}/>
							<><label>Email</label></>
							<TextField margin='normal' id='email' type={'email'} variant='outlined' placeholder='Email' value={data.email} style={{margin: "0px 0px 0px 0px"}}/>
							<><label>Bio</label></>
							<TextField margin='normal' id='bio' type={'text'} variant='outlined' placeholder='Bio' value={data.bio} multiline minRows={3} maxRows={7} style={{margin: "0px 0px 0px 0px"}}/>
							<><label>New password</label></>
							<TextField margin='normal' id='newPassword' type={'password'} variant='outlined' placeholder='New password' style={{margin: "0px 0px 0px 0px"}}/>
							<><label>Password</label></>
							<TextField margin='normal' id='password' type={'password'} variant='outlined' placeholder='Password (required)' style={{margin: "0px 0px 0px 0px"}}/>
						</div>
						<div className='sign-up-form2-section section3'>
							<img id='avatar' height="350px" width="350px"/>
							<div className='sign-up-form2-choose-file'>
								<input type="file" name="file" id='image' onChange={handleUploadImage} />
							</div>
						</div>
					</div>
						<Button onClick={handleSubmit} buttonStyle='btn--5' buttonSize="btn--medium" >Save changes</Button>
            	</Box>
       		</form>
    	</div>
  	)
}

export default Profile