// Declaramos 'breeds' en el ámbito global
let breeds;

// Función para obtener las razas y sub-razas de perros de la API
const getDogBreeds = async () => {

    try {
        const response = await fetch("https://dog.ceo/api/breeds/list/all");
        const data = await response.json();
        // data.message contiene un objeto con las razas como claves y las sub-razas como valores
        return data.message;
    } catch (error) {
        console.error("Error al obtener las razas de perros:", error);
    }
};

// Función para generar el HTML para una sola raza
const generateBreedHTML = (breed, subBreeds) => {

    let breedHTML = `
    <div class="d-flex w-100 list-group-item list-group-item-action list-group-item-success d-flex py-3">
        <div>
        <a href="#" class="breed text-decoration-none text-success" data-breed="${breed}" aria-current="true" data-bs-toggle="modal" data-bs-target="#dogModal"><span class="mb-2 fw-bold" style="text-transform: uppercase;">${breed}</span></a>`;

    if (subBreeds.length > 0) {
        breedHTML += `<hr><strong>Sub-razas:</strong>`;
        for (let subBreed of subBreeds) {
            breedHTML += `<a href="#" class="subBreed text-decoration-none text-success" data-breed="${breed}" data-subBreed="${subBreed}" data-bs-toggle="modal" data-bs-target="#dogModal"><p style= "text-align: left;">• ${subBreed}</p></a>`;
        }
    }
    breedHTML += `</div></div>`;
    return breedHTML;
};

// Función para generar el HTML de lista para todas las razas y sub-razas de los perros
const generateAllBreedsHTML = (breeds) => {

    let allBreedsHTML = "";
    let breedCount = 0;
    let subBreedCount = 0;

    //Iteramos sobre cada raza
    for (let breed in breeds) {
        allBreedsHTML += generateBreedHTML(breed, breeds[breed]);
        breedCount++;
        subBreedCount += breeds[breed].length;
    }
    return { html: allBreedsHTML, breedCount, subBreedCount };
};

//Función para filtrar las razas de perros
const filterDogBreeds = (searchTerm, breeds) => {
    let filteredBreeds = {};
    for (let breed in breeds) {
        if (breed.includes(searchTerm.toLowerCase())) {
            filteredBreeds[breed] = breeds[breed];
        }
    }
    return filteredBreeds;
};

// Función para ordenar las razas de perros
const sortDogBreeds = (breeds, ascending = true) => {

    console.log(breeds);
    // Convertimos el objeto en un array y lo ordenamos
    let sortedBreeds = Object.keys(breeds).sort();
    if (!ascending) {
        sortedBreeds.reverse();
    }
    // Convertimos el array ordenado de nuevo en un objeto
    let sortedBreedsObject = {};
    for (let breed of sortedBreeds) {
        sortedBreedsObject[breed] = breeds[breed];
    }
    return sortedBreedsObject;
};

//Agregamos el evento click a cada raza y subraza
const addClickEventsToBreeds = () => {
    document.querySelectorAll(".breed, .subBreed").forEach((item) => {
        item.addEventListener("click", async (event) => {
            event.preventDefault();
            let target = event.target;
            while (!target.dataset.breed) {
                target = target.parentElement;
            }
            let breed = target.dataset.breed;
            let subBreed = target.dataset.subbreed;
            let url = `https://dog.ceo/api/breed/${breed}${subBreed ? `/${subBreed}` : ""
                }/images/random`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                document.getElementById("dogImage").src = data.message;
                console.log(data.message);
            } catch (error) {
                console.error("Error al obtener la imagen de la raza de perro:", error);
            }
        });
    });
};

//Función principal
const fetchDogBreedsAll = async () => {
    breeds = await getDogBreeds();
    breeds = sortDogBreeds(breeds);
    const { html: allBreedsHTML, breedCount, subBreedCount } = generateAllBreedsHTML(breeds);
    displayResults(allBreedsHTML, breedCount, subBreedCount);
    addClickEventsToBreeds();
    addSearchEvent();
    addResetEvent();
};

const displayResults = (allBreedsHTML, breedCount, subBreedCount) => {
    document.getElementById("dogBreeds").innerHTML = allBreedsHTML;
    document.getElementById("breedCount").innerHTML = `Total de razas: <span class="badge rounded-pill text-bg-dark">${breedCount}</span>`;
    document.getElementById("subBreedCount").innerHTML = `Total de sub-razas: <span class="badge rounded-pill text-bg-dark">${subBreedCount}</span>`;
};

const addSearchEvent = () => {
    document.getElementById("searchButton").addEventListener("click", (event) => {
        event.preventDefault();
        let searchTerm = document.getElementById("searchInput").value;
        let filteredBreeds = filterDogBreeds(searchTerm, breeds);
        const { html: allBreedsHTML, breedCount, subBreedCount } = generateAllBreedsHTML(filteredBreeds);
        displayResults(allBreedsHTML, breedCount, subBreedCount);
        addClickEventsToBreeds();

        //Obtenemos el elemento de alerta
        const searchAlert = document.getElementById("searchAlert");

        //Si se encontraron coicidencias, muestra la alerta con el mensaje
        if (breedCount > 0 || subBreedCount > 0) {
            searchAlert.innerHTML = `
            <div class="alert alert-success d-flex align-items-center" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill me-1" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
            <div>
                Se encontraron las siguientes coincidencias
            </div>
            </div>`;
            searchAlert.classList.remove("d-none");
        } else {
            //Si no se encontraron coincidencias, mostramos una alerta con un mensaje y ocultamos la alerta
            searchAlert.innerHTML = `
            <div class="alert alert-danger d-flex align-items-center" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill me-1" viewBox="0 0 16 16">
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
            </svg>
            <div>
                No se encontraron resultados para tu búsqueda
            </div>
            </div>`;
            searchAlert.classList.remove("d-none");
        }

        //Configuramos un temporizador para ocultarla después de 5 segundos
        if (!searchAlert.classList.contains("d-none")) {
            setTimeout(() => {
                searchAlert.classList.add("d-none");
            }, 5000);

        }
    });
};

const addResetEvent = () => {
    document.getElementById("resetButton").addEventListener("click", (event) => {
        event.preventDefault();
        const { html: allBreedsHTML, breedCount, subBreedCount } = generateAllBreedsHTML(breeds);
        displayResults(allBreedsHTML, breedCount, subBreedCount);
        addClickEventsToBreeds();
    });
};

// Evento click para el botón de orden ascendente
document.getElementById("ascButton").addEventListener("click", (event) => {
    event.preventDefault();
    event.currentTarget.classList.add("active");
    document.getElementById( "descButton" ).classList.remove("active");
    breeds = sortDogBreeds(breeds);
    const { html: allBreedsHTML, breedCount, subBreedCount } = generateAllBreedsHTML(breeds);
    displayResults(allBreedsHTML, breedCount, subBreedCount);
    addClickEventsToBreeds();
});

// Evento click para el botón de orden descendente
document.getElementById("descButton").addEventListener("click", (event) => {
    event.preventDefault();
    event.currentTarget.classList.add("active");
    document.getElementById("ascButton").classList.remove("active");
    breeds = sortDogBreeds(breeds, false);
    const { html: allBreedsHTML, breedCount, subBreedCount } = generateAllBreedsHTML(breeds);
    displayResults(allBreedsHTML, breedCount, subBreedCount);
    addClickEventsToBreeds();
});


// Evento click para el botón de imagen aleatoria
document.getElementById("randomButton").addEventListener("click", async (event) => {
    event.preventDefault();
    const imageUrl = await getRandomDogImage();
    document.getElementById("dogImage").src = imageUrl;
});

// Función para obtener una imagen aleatoria de un perro
const getRandomDogImage = async () => {
    try {
        const response = await fetch("https://dog.ceo/api/breeds/image/random");
        const data = await response.json();
        return data.message;
    } catch (error) {
        console.error("Error al obtener la imagen del perro:", error);
    }
};

// Obtenemos el elemento de entrada de la búsqueda
const searchInput = document.getElementById("searchInput");

// Agregamos un evento de escucha para la tecla Enter
searchInput.addEventListener("keyup", function(event) {
    // El número 13 es el código de tecla para Enter
    if (event.keyCode === 13) {
        event.preventDefault();
        //que haga click  en el boton buscar
        document.getElementById("searchButton").click();
    }
});

document.getElementById("clearButton").addEventListener("click", function() {
    document.getElementById("searchInput").value = "";
  });

fetchDogBreedsAll();