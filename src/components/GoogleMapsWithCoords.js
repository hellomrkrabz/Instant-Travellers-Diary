import { withScriptjs, withGoogleMap, GoogleMap, Marker, SearchBox } from "react-google-maps";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { compose, withProps } from "recompose"

var marker=
  {
	  id:1,
	  lat:1,
	  lng:1
  }

var markers=[marker];

function assignMarkers(mar){
  for(var i=0; i<mar.length; i++){
    markers.push({id: i,
      lat: parseFloat(mar[i].lat),
      lng: parseFloat(mar[i].lng)
    });
  }
}

async function awaiting(){ 
const res = await fetch("http://localhost:3000/api/Events/1")
  const resJson = await res.json()
  assignMarkers(resJson);
}


const GoogleMaps = (prop) => {
	const [cos,setCos] = useState(0);
	
  //awaiting();
  //console.log(markers);
  
  
const MyMapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `1080px` }} />,
    mapElement: <div style={{ width: `50%`, height: `50%` }} />,
  }), withScriptjs, withGoogleMap)((props) =>
  <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: parseFloat(markers[0].lat), lng: parseFloat(markers[0].lng) }}
	onClick={(e) => {
    console.log("latitude = ", e.latLng.lat());
    console.log("longtitude = ", e.latLng.lng());
	
	var marker={
		id: 1,
		lat: e.latLng.lat(),
		lng: e.latLng.lng()
	}
	
	markers[0]=marker;
	markers[1]=marker;
	console.log(markers);
	setCos(Math.random());
	
	console.log(prop);
	
	prop.setCoords(e.latLng.lat(),e.latLng.lng());
	
	}}
  >              

    {props.isMarkerShown && markers.map(marker => (
    <Marker
      position={{ lat: marker.lat, lng: marker.lng }}
      key={marker.id}
    />
    ))} />}
  </GoogleMap>
);

	return (
		  <>
			<MyMapComponent isMarkerShown />
		  </>
	  );

};

export default GoogleMaps;