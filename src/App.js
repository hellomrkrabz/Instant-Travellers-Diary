import './App.css';
import Navbar from './components/Navbar';
import {  BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Home from'./components/pages/Home';
import Auth from './components/Auth';

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
      <h1>Test</h1>
      <p>{data.msg1}</p>
      <p>{data.msg2}</p>
    </div>
  );
}

export default App;
