import './App.css';
import Navbar from './components/Navbar';
import {  BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Home from'./components/pages/Home';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';

import { useState, useEffect } from "react";
import axios, {isCancel, AxiosError} from 'axios';

function App() {

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
  
  
  

  return (
    <div>
	
		<Router>
        <Navbar/>
        <Switch>
          <Route path="/" exact component={Home}/>
		  <Route path="/Register" exact component={Register}/>
		  <Route path="/Login" exact component={Login}/>
		  <Route path="/Profile" exact component={Profile}/>
        </Switch>
      </Router>
	  
      
    </div>
  );
}

export default App;
