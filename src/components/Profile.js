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
		

  
  avatar=setAvatar(data.avatarUrl);
  var red='#eb3449';
  
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
		var response = this.responseText;
		
		let email = /[a-zA-Z0-9]{1,}[@]{1}[a-z0-9]{1,}[.]{1}[a-z0-9]{1,}/.exec(response);
		document.getElementById('email').value=email;
		
		var res=response.replace(/"/,'d');
		var res=res.replace(/"/,'d');
		var res=res.replace(/"/,'d');
		var res=res.replace(/"/,'d');
		var res=res.replace(/"/,'d');
		var res=res.replace(/"/,'d');
		var begin = res.search(/"/);
		var res=res.replace(/"/,'d');
		var end = res.search(/"/);
		var username=res.slice(begin+1,end);
		
		document.getElementById('username').value=username;
	  }
	};

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
                <Typography className='typography' variant='h2'>Your profile!</Typography>
				<img src={avatar} height="150px" width="150px"/>
				<TextField margin='normal' id='username' type={'text'} variant='outlined' placeholder='Nick' value={data.nick}/>
                <TextField margin='normal' id='email' type={'email'} variant='outlined' placeholder='Email' value={data.email}/>
				<Button buttonStyle='btn--2' buttonSize="btn--medium"  path="/EditProfile">Edit profile</Button>
            </Box>
        </form>
    </div>
  )
}

export default Profile