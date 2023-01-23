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
  var ev = mar.stages[0].events
  for(var i=0; i<ev.length; i++){
    markers.push({id: parseFloat(ev[i].id),
      lat: parseFloat(ev[i].lat),
      lng: parseFloat(ev[i].lng)
    });
  }
}

async function awaiting(id){ 
const res = await fetch("http://localhost:3000/api/Stages/" + id)
  const resJson = await res.json();
  console.log(resJson);
  assignMarkers(resJson);
}


const GoogleMapsStages = (props) => {
  console.log(props);
  awaiting(props.ids);
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

export default GoogleMapsStages;