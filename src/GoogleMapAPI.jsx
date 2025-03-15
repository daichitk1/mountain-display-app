import React from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { Map, Marker } from "@vis.gl/react-google-maps";
const GoogleMapAPI = (props) => (
  <APIProvider apiKey={import.meta.env.VITE_APP_GOOGLE_MAP_API_KEY}>
    <div className="mx-auto w-full h-60">
      <Map zoom={8} center={{ lat: props.latitude, lng: props.longitude }}>
        <Marker position={{ lat: props.latitude, lng: props.longitude }} />
      </Map>
    </div>
  </APIProvider>
);
export default GoogleMapAPI;
