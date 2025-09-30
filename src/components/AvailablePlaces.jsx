import Places from './Places.jsx';
import {useEffect, useState} from "react";
import ErrorPage from "../components/Error.jsx"
import {sortPlacesByDistance} from "../loc.js";
import {fetchPlacesData} from "../http.js";
import useFetch from "../hooks/useFetch.jsx";

async function fetchSortedPlaces(){
    const places = await fetchPlacesData();
    return new Promise((resolve,reject)=>{
        navigator.geolocation.getCurrentPosition(position => {
            const sortedPlaces = sortPlacesByDistance(places, position.coords.latitude, position.coords.longitude)
            resolve(sortedPlaces);
        })
    })
}


export default function AvailablePlaces({ onSelectPlace }) {
    const {isFetching : isLoading,fetchedData : availablePlaces,error} = useFetch(fetchSortedPlaces,[]);

    if(error){
        return <ErrorPage message={error.message} title="An error Occured!" />
    }

    return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading = {isLoading}
      loadingText = "fetching places ..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
