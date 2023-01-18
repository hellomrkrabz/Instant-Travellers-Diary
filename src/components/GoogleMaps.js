import { withScriptjs, withGoogleMap, GoogleMap, Marker, SearchBox } from "react-google-maps";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const GoogleMaps = () => {
const MyMapComponent =  withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: -34.397, lng: 150.644 }}
  >
    {props.isMarkerShown && <Marker position={{ lat: -34.397, lng: 150.644 }} />}
  </GoogleMap>
))
return (
      <>
        <MyMapComponent isMarkerShown
  googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
  loadingElement={<div style={{ height: `100%` }} />}
  containerElement={<div style={{ height: `1080px` }} />}
  mapElement={<div style={{ width: `50%`, height: `50%` }} />} />  
      </>
  );
};

export default GoogleMaps;