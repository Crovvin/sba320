import { useState, useEffect } from "react";

function Pets(){
    const API_KEY_D = "live_ZlyfXWSv5zNoTTCUJ0ZpUw5u2pFiEHFTK7HYsKm96XU1YfTkvKH1mKXZRBCLOwoi";
    const [dogs, setDogs] = useState([]);
    const API_KEY_C = "live_iejToRiu2AT4sNHcsha63QSFDgaCUISOfVo8v6AQDCbI05ayifdMBWfRwSZC15Li";
    const [cats, setCats] = useState([]);
    const [breeds, setBreeds] = useState([]);
    const [selection, setSelection] = useState("");

    useEffect(() => {
        const getBreed = async () => {
          try {
            const dogRes = await fetch("https://api.thedogapi.com/v1/breeds", {
              headers: { "x-api-key": API_KEY_D },
            });
            const dogData = await dogRes.json();
    
            const catRes = await fetch("https://api.thecatapi.com/v1/breeds", {
              headers: { "x-api-key": API_KEY_C },
            });
            const catData = await catRes.json();
    
            const allBreeds = [
              ...dogData.map((breed) => ({ ...breed, type: "Dog" })),
              ...catData.map((breed) => ({ ...breed, type: "Cat" }))
            ];
    
            allBreeds.sort((a, b) => a.name.localeCompare(b.name));
            setBreeds(allBreeds);
          } catch (error) {
            console.error(error);
          }
        };
    
        getBreed();
      }, []);
    
      const getInfo = async () => {
        if (!selection) return;
        try {
          const selectedBreed = breeds.find((b) => b.name === selection);
          
          if (selectedBreed) {
            const apiUrl = selectedBreed.type === "Dog"
              ? `https://api.thedogapi.com/v1/images/search?breed_id=${selectedBreed.id}&limit=3`
              : `https://api.thecatapi.com/v1/images/search?breed_id=${selectedBreed.id}&limit=3`;
            
            const chosenKey = selectedBreed.type === "Dog" ? API_KEY_D : API_KEY_C;
            const imgRes = await fetch(apiUrl, {
              headers: { "x-api-key": chosenKey },
            });
            const imageData = await imgRes.json();
            
            if (selectedBreed.type === "Dog") {
              setDogs([{ ...selectedBreed, images: imageData.map(img => img.url) }]);
              setCats([]);
            } else {
              setCats([{ ...selectedBreed, images: imageData.map(img => img.url) }]);
              setDogs([]);
            }
          }
        } catch (error) {
          console.error(error);
        }
      };
    
      return (
        <div>
          <div>
            <select value={selection} onChange={(e) => setSelection(e.target.value)}>
              <option value="">Select a Breed</option>
              {breeds.map((breed) => (
                <option key={breed.id} value={breed.name}>{breed.name} ({breed.type})</option>
              ))}
            </select>
            <button onClick={getInfo}>Search</button>
          </div>
          <div>
            {dogs.map((dog) => (
              <div key={dog.id}>
                <h3>{dog.name}</h3>
                {dog.images && dog.images.map((img, index) => <img key={index} src={img} alt={dog.name} style={{ width: "200px", height: "auto", margin: "5px" }} />)}
                <p>Breed Group: {dog.breed_group}</p>
                <p>Temperament: {dog.temperament}</p>
                <p>Weight: {dog.weight.imperial} lbs</p>
                <p>Life Span: {dog.life_span}</p>
              </div>
            ))}
            {cats.map((cat) => (
              <div key={cat.id}>
                <h3>{cat.name}</h3>
                {cat.images && cat.images.map((img, index) => <img key={index} src={img} alt={cat.name} style={{ width: "200px", height: "auto", margin: "5px"  }} />)}
                <p>Temperament: {cat.temperament}</p>
                <p>Weight: {cat.weight.imperial} lbs</p>
                <p>Life Span: {cat.life_span}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

export default Pets;