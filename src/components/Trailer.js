import React from 'react';
import { Button } from './Button';
import { Link } from "react-router-dom";

const src =
  "https://youtu.be/acfTRaZtews";

const Trailer = () => {
  return (
  	<>
  	<div>
  	<Link to={`/`}>
        <button className="button-add">GO BACK</button>
    </Link>
    </div>
    <div>
    <video controls width="100%">
      <source src={src} type="video/mp4" />
      Sorry, your browser doesn't support embedded videos.
    </video>
    </div>
    </>
  );
};

export default Trailer;