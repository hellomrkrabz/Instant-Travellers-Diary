import './App.css';
import Navbar from './components/Navbar';
//import {  BrowserRouter as Router, Switch, Route} from "react-router-dom";
import { Routes ,Route,Router,BrowserRouter } from 'react-router-dom';
import Home from'./components/pages/Home';
import Auth from'./components/Register';
import Login from'./components/Login';

function App() {
	console.log("kurwa");

  return (
    <div>
  

	  
		<BrowserRouter>
		<Navbar />
			<Routes>
				<Route>
					<Route index element={<Home/>}/>//to jest default
					<Route path="/Register" element={<Auth/>}/>//tak sie robi przekierowanie
					<Route path="/Login" element={<Login/>}/>//tak sie robi przekierowanie
				</Route>
			</Routes>
		</BrowserRouter>
      
     
      
    
    </div>
  );
}

export default App;
