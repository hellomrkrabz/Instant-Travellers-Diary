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
  axios.post("http://127.0.0.1:5000/EditProfile", {
    email: document.getElementById("email").value,
    username: document.getElementById("username").value, 
    password: document.getElementById("password").value,
	confirmPassword: document.getElementById("confirmPassword").value
  }).then((response) => { setTimeout(redirect(response.data.msg), 1000)})
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


function Profile() {
	
	const [data, setData] = useState([])
	
  useEffect(() => {
    axios.get("/api/test")
      .then((response) => {
        console.log(response)
        const data = response.data
        console.log(data)
        setData(data)
      })
      .catch(error => {
        alert(error)
      })
  }, [])	
  
  
	avatar=setAvatar(data.avatarUrl);
  
	
	var id = '<%=session.getAttribute("user_id")%>';
	console.log(id);
	alert(id)
	
	
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

	//ustawcie sesje
	var userId=1;
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
				<TextField margin='normal' id='password' type={'password'} variant='outlined' placeholder='Password'/>
                <TextField margin='normal' id='confirmPassword' type={'password'} variant='outlined' placeholder='Confirm password'/>
				<Button onClick={handleSubmit} buttonStyle='btn--2' buttonSize="btn--medium">Save changes</Button>
            </Box>
        </form>
    </div>
  )
}

export default Profile