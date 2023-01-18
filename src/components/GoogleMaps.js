import { withScriptjs, withGoogleMap, GoogleMap, Marker, SearchBox } from "react-google-maps";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { compose, withProps } from "recompose"

let markers=[
    {
        id:1,
        latitude: 25.0391667,
        longitude: 121.525,
        shelter:'marker 1'

    },
    {
        id: 2,
        latitude: 24.0391667,
        longitude: 110.525,
        shelter: 'marker 2'

    },
    {
        id: 3,
        latitude: 20.0391667,
        longitude: 100.525,
        shelter: 'marker 3'

    }
]


  


const GoogleMaps = () => {
const MyMapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `1080px` }} />,
    mapElement: <div style={{ width: `50%`, height: `50%` }} />,
  }), withScriptjs, withGoogleMap)((props) =>
  <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: markers[0].latitude, lng: markers[0].longitude }}
  >              

    {props.isMarkerShown && markers.map(marker => (
    <Marker
      position={{ lat: marker.latitude, lng: marker.longitude }}
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