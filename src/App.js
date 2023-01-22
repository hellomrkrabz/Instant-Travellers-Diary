import './App.css';
import Navbar from './components/Navbar';
import {  BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Home from'./components/pages/Home';
import Register from './components/Register';
import Tutorial from './components/Tutorial';
import Login from './components/Login';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import Logout from './components/Logout';
import NoPage1 from './components/NoPage1';
import NoPage2 from './components/NoPage2';
import GoogleMaps from './components/GoogleMaps';

import { useState, useEffect } from "react";
import axios, {isCancel, AxiosError} from 'axios';

import Journeys from './components/Journeys';
import Stages from './components/Stages';
import Events from './components/Events';
import Sites from  './components/Sites';

function App() {
	
  const [data, setData] = useState([])

  // useEffect(() => {
  //   axios.get("/api/test")
  //     .then((response) => {
  //       console.log(response)
  //       const data = response.data
  //       console.log(data)
  //       setData(data)
  //     })
  //     .catch(error => {
  //       // alert(error)
  //     })
  // }, [])
  
  
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


	if(!userId) 
	{
	  return (
		<div>
			<Router>
			<Navbar/>
			<Switch>
					<Route path="/" exact component={Home}/>
					<Route path="/Register" exact component={Register}/>
					<Route path="/Tutorial" exact component={Tutorial}/>
					<Route path="/Login" exact component={Login}/>
					<Route path="*" exact component={NoPage1}/>
			</Switch>
		  </Router>
		  
		  
		</div>
	  );
	}else
	{
		return (
		<div>
			<Router>
			<Navbar/>
			<Switch>
				  <Route path="/Profile" exact component={Profile}/>
				  <Route path="/EditProfile" exact component={EditProfile}/>
				  <Route path="/Logout" exact component={Logout}/>
				  <Route path="/Journeys" exact component={Journeys} />
                  <Route path="/Stages/:id" exact component={Stages}/>
				  <Route path="/Events/:id" exact component={Events}/>
				  <Route path="/GoogleMaps" exact component={GoogleMaps}/>
				  <Route path="/Sites/:id" exact component={Sites}/>
				  <Route path="*" exact component={NoPage2}/>

			</Switch>
		  </Router>
		</div>
	  );
	}
}

export default App;
