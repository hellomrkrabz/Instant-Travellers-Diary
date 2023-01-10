import React from 'react'
import {useState, useEffect} from "react";
import { Button } from './Button';
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from "react-router-dom";
import './Navbar.css';
import logo from './logo.png';

function Navbar() {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);


    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    const showButton = () => {
        if (window.innerWidth <= 960) {
          setButton(false);
        } else {
          setButton(true);
        }
      };
    
      useEffect(() => {
        showButton();
      }, []);

      window.addEventListener('resize', showButton);

	console.log(document.URL);

	if(document.URL=='http://localhost:3000/' || document.URL=='http://localhost:3000/Login' || document.URL=='http://localhost:3000/Register')
	{
	  return (
		<>
			<nav className='navbar'>
			
				<div className='navbar-container'>
				<Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
					<img src={logo} width="280" height="50"/>
					</Link>
					
					<div className='menu-icon' onClick={handleClick}>
					
					  {click ? <CloseIcon className='fa-times'/> : <MenuIcon className='fa-bars'/>}

					</div>
					<ul className={click ? 'nav-menu active' : 'nav-menu'}>
						<li className='nav-item'>
							<Link to= '/' className='nav-links' onClick={closeMobileMenu}>
								Home
							</Link>
						</li>
						<li className='nav-item'>
							<Link to= '/Login' className='nav-links' onClick={closeMobileMenu}>
								Login
							</Link>
						</li>
					</ul>
					{button && <Button buttonStyle='btn--outline' path="/Register">Register</Button>}
				</div>

			</nav>
		</>
	  )
	}else
	{
		return (
		<>
			<nav className='navbar'>
			
				<div className='navbar-container'>
				<Link to='/Profile' className='navbar-logo' onClick={closeMobileMenu}>
					<img src={logo} width="280" height="50"/>
					</Link>
					
					<div className='menu-icon' onClick={handleClick}>
					
					  {click ? <CloseIcon className='fa-times'/> : <MenuIcon className='fa-bars'/>}

					</div>
					<ul className={click ? 'nav-menu active' : 'nav-menu'}>
						<li className='nav-item'>
							<a href= '/Journeys' className='nav-links' onClick={closeMobileMenu}>
								Journeys
							</a>
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