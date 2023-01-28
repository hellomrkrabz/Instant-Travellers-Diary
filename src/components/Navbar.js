import React from 'react'
import {useState, useEffect} from "react";
import { Button } from './Button';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from "react-router-dom";
import './Navbar.css';
import logo from './logo.png';
import setCss from "./setCSS"

function Navbar()
{
	const [click, setClick] = useState(false);
	const [button, setButton] = useState(true);

	const handleClick = () => setClick(!click);
	const closeMobileMenu = () => setClick(false);

	const showButton = () =>
	{
		if(window.innerWidth <= 960)
		{
			setButton(false);
		}
		else
		{
			setButton(true);
		}
	};

	useEffect(() =>
	{
		showButton();
	}, []);

	window.addEventListener('resize', showButton);

	if(document.URL == 'http://localhost:3000/' || document.URL == 'http://localhost:3000/Login' || document.URL == 'http://localhost:3000/Register')
	{
		return ( 
			<>
				{ setCss() } 
				<nav className = 'navbar' >
					<div className = 'navbar-container' >
						<Link to = '/' className = 'navbar-logo' onClick = { closeMobileMenu } >
							<img src = { logo } width = "280" height = "50" />
						</Link>

						<div className = 'menu-icon' onClick = { handleClick } >
							{ click ? 
								<CloseIcon className = 'fa-times' /> 
								:
								< MenuIcon className = 'fa-bars' /> 
							}
						</div> 
						<ul className = { click ? 'nav-menu active' : 'nav-menu' } >
							<li className = 'nav-item' >
								<Link to = '/' className = 'nav-links' onClick = { closeMobileMenu }>Home </Link> 
							</li> 
							<li className = 'nav-item' >
								<Link to = '/Login' className = 'nav-links' onClick = { closeMobileMenu } >Login </Link> 
							</li> 
						</ul>
						{ button && < Button buttonStyle = 'btn--outline' path = "/Register" > Register < /Button>} 
					</div> 
				</nav> 
			</>
		)
	}
	else if(document.URL == 'http://localhost:3000/Profile')
	{
		return ( 
			<>
				{ setCss() } 
				<nav className = 'navbar' >
					<div className = 'navbar-container' >
						<Link to = '/' className = 'navbar-logo' onClick = { closeMobileMenu } >
							<img src = { logo } width = "280" height = "50" />
						</Link>

						<div className = 'menu-icon' onClick = { handleClick } >
							{ click ? 
								<CloseIcon className = 'fa-times' /> 
								:
								< MenuIcon className = 'fa-bars' /> 
							}
						</div> 
						<ul className = { click ? 'nav-menu active' : 'nav-menu' } >
							<li className = 'nav-item' >
								<Link to = '/Journeys' className = 'nav-links' onClick = { closeMobileMenu }>Journeys </Link> 
							</li> 
							<li className = 'nav-item' >
								<Link to = '/EditProfile' className = 'nav-links' onClick = { closeMobileMenu } >Edit Profile</Link> 
							</li> 
							<li className='nav-item'>
								<Link to= '/Logout' className='nav-links' onClick={closeMobileMenu}>
									Logout
								</Link>
							</li>
						</ul>
					</div> 
				</nav> 
			</>
		)
	}
	else
	{
		return ( 
			<>
				{ setCss() } 
				<nav className = 'navbar' >
					<div className = 'navbar-container' >
						<Link to = '/' className = 'navbar-logo' onClick = { closeMobileMenu } >
							<img src = { logo } width = "280" height = "50" />
						</Link>

						<div className = 'menu-icon' onClick = { handleClick } >
							{ click ? 
								<CloseIcon className = 'fa-times' /> 
								:
								< MenuIcon className = 'fa-bars' /> 
							}
						</div> 
						<ul className = { click ? 'nav-menu active' : 'nav-menu' } >
							<li className = 'nav-item' >
								<Link to = '/' className = 'nav-links' onClick = { closeMobileMenu }>Home </Link> 
							</li> 
							<li className = 'nav-item' >
								<Link to = '/Profile' className = 'nav-links' onClick = { closeMobileMenu } >Profile</Link> 
							</li> 
							<li className='nav-item'>
								<Link to= '/Logout' className='nav-links' onClick={closeMobileMenu}>
									Logout
								</Link>
							</li>
						</ul>
					</div> 
				</nav> 
			</>
		)
	}
}

export default Navbar