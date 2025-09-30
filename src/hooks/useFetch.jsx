import {useEffect, useState} from "react";

export default function useFetch(fetchFn,initialValue){

    const [isFetching,setIsFetching] = useState();
    const [fetchedData,setFetchedData] = useState(initialValue);
    const [error,setError] = useState();

    useEffect(()=>{
        setIsFetching(true);
        async function fetchPlaces(){
            try{
                const places = await fetchFn();
                setFetchedData(places);

            }
            catch(e){
                setError({message : e.message || "failed to load userPlace......."})
            }
            setIsFetching(false);
        }
        fetchPlaces();
    },[fetchFn])


    return {
        isFetching,
        fetchedData,
        error,
        setFetchedData
    }
}