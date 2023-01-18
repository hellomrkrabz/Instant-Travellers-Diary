import { withScriptjs, withGoogleMap, GoogleMap, Marker, SearchBox } from "react-google-maps";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { compose, withProps } from "recompose"

var markers=[];

function assignMarkers(mar){
  for(var i=0; i<mar.events.length; i++){
    markers.push({id: i,
      lat: parseFloat(mar.events[i].lat),
      lng: parseFloat(mar.events[i].lng)
    });
  }
}

async function awaiting(){ 
const res = await fetch("http://localhost:3000/api/Events/1")
  const resJson = await res.json()
  assignMarkers(resJson);
}


const GoogleMaps = () => {
  awaiting();
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