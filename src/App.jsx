import {useRef, useState, useCallback, useEffect} from 'react';

import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import {addPlace} from "./http.js";
import ErrorPage from "./components/Error.jsx";
import {fetchUserPlaces} from "./http.js";
import useFetch from "./hooks/useFetch.jsx";

function App() {
  const selectedPlace = useRef();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const[errorUpdatingPlaces,setErrorUpdatingPlaces] = useState();

  const {isFetching,error,fetchedData:userPlaces,setFetchedData : setUserPlaces} = useFetch(fetchUserPlaces,[]);

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });
    try{
        await addPlace([selectedPlace,...userPlaces])

    }
    catch (e){
        setUserPlaces([...userPlaces]);
        setErrorUpdatingPlaces({message : e.message || "something went wrong!"})
    }
  }

  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );

    try{
        await addPlace(userPlaces.filter(p => p.id !== selectedPlace.current.id));
    }
    catch(e){
        setUserPlaces(userPlaces);
        setErrorUpdatingPlaces({message : e.message || "failed to delete..."})
    }
    setModalIsOpen(false);
  }, [setUserPlaces,userPlaces]);


  function handleError(){
      setErrorUpdatingPlaces(null);
  }

  return (
    <>
        {errorUpdatingPlaces && <Modal open={errorUpdatingPlaces} onClose={handleError}>
            <ErrorPage
                title="Error Occured"
                onConfirm={handleError}
                message={errorUpdatingPlaces.message}
            />
            </Modal>}

      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
          {error && <ErrorPage title="Error...." message={error.message} />}
          {!error && <Places
              title="I'd like to visit ..."
              fallbackText="Select the places you would like to visit below."
              places={userPlaces}
              onSelectPlace={handleStartRemovePlace}
              isLoading={isFetching}
              loadingText="fetching your data ..."
          />}

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
