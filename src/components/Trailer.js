import React from 'react';
import { Button } from './Button';
import { Link } from "react-router-dom";
import  "./trailer.css"

const Trailer = () => {
  return (
  	<>
  	<div> 
  	<Link to={`/`}>
        <button className="button-add">GO BACK</button>
    </Link>
    </div>
	
	<div className="video-container">
		<video className="video-trailer" src = '/videos/trailer.mp4' autoPlay loop muted="false" />
	</div>
    </>
  );
};

export default Trailer;