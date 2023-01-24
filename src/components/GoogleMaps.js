import { withScriptjs, withGoogleMap, GoogleMap, Marker, SearchBox } from "react-google-maps";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { compose, withProps } from "recompose"
import getCookie from "./getCookie"
import "./GoogleMaps.css"

var markers=[];

function assignMarkers(mar){
  for(var i=0; i<mar.ids.length; i++){
    markers.push({id: parseFloat(mar.ids[i].id),
      lat: parseFloat(mar.ids[i].lat),
      lng: parseFloat(mar.ids[i].lng)
    });
  }
}

async function awaiting(refresh){ 
const res = await fetch("http://localhost:3000/api/EventIds/" + getCookie())
  const resJson = await res.json()
  refresh(true);
  assignMarkers(resJson);
}


const GoogleMaps = () => {
	const [refresh,setRefresh] =useState(false);
  awaiting(setRefresh);
  //console.log(markers);
const MyMapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `1080px` }} />,
    mapElement: <div style={{ width: `100%`, height: `50%` }} />,
  }), withScriptjs, withGoogleMap)((props) =>
  <GoogleMap
    defaultZoom={1.5}
    defaultCenter={{ lat: 0, lng: 0 }}
  >              

    {props.isMarkerShown && markers.map(marker => (
    <Marker
      position={{ lat: marker.lat, lng: marker.lng }}
      key={marker.id}
    />
    ))}
  </GoogleMap>
);
return (
      <>
        <MyMapComponent isMarkerShown />
      </>
  );
};

export default GoogleMaps;