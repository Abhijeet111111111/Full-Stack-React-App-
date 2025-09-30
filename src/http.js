export async function fetchPlacesData(){
    const response = await fetch("http://localhost:3000/places");
    const placesData = await response.json();
    if(!response.ok){
        throw new Error("something went wrong !")
    }
    return placesData.places;
}



export async function addPlace(places){
    const response = await fetch("http://localhost:3000/user-places",{
        method : 'PUT',
        body : JSON.stringify({places}),
        headers : {
            'Content-Type'  : 'application/json'
        }

    })
    const resData = await response.json()
    if(!response.ok){ // !!!!!!!!!!!!
        throw new Error("failed user req...")
    }
    return resData.message
}

export async function fetchUserPlaces(){
    const response = await fetch("http://localhost:3000/user-places")
    const resData = await response.json()
    if(!response.ok){
        throw new Error("failed to fetch places...")
    }
    return resData.places
}
