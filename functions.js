//Función para obtener las razas y sub-razas de perros de la API
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

//Función para generar el HTML para una sola raza
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

//Función para generar el HTML de lista para todas las razas y sub-razas de los perros
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
    const breeds = await getDogBreeds();
    const { html: allBreedsHTML, breedCount, subBreedCount } = generateAllBreedsHTML(breeds);

    //Mostramos los resultados en la vista HTML
    document.getElementById("dogBreeds").innerHTML = allBreedsHTML;
    document.getElementById(
        "breedCount"
    ).innerHTML = `Total de razas: <span class="badge rounded-pill text-bg-dark">${breedCount}</span>`;
    document.getElementById(
        "subBreedCount"
    ).innerHTML = `Total de sub-razas: <span class="badge rounded-pill text-bg-dark">${subBreedCount}</span>`;

    //Agregamos el evento click a cada raza y subraza
    addClickEventsToBreeds();

    //Agregamos el evento click al botón de busqueda
    document.getElementById("searchButton").addEventListener("click", (event) => {
        event.preventDefault();
        let searchTerm = document.getElementById("searchInput").value;
        let filteredBreeds = filterDogBreeds(searchTerm, breeds);
        const { html: allBreedsHTML, breedCount, subBreedCount } = generateAllBreedsHTML(filteredBreeds);

        if (breedCount === 0) {
            document.getElementById("dogBreeds").innerHTML = `<p class="text-center text-danger">No se encontraron coincidencias para "${searchTerm}".</p>`;
        } else {
            document.getElementById("dogBreeds").innerHTML = allBreedsHTML;
            addClickEventsToBreeds();
        }

        document.getElementById("breedCount").innerHTML = `Total de razas: <span class="badge rounded-pill text-bg-dark">${breedCount}</span>`;
        document.getElementById("subBreedCount").innerHTML = `Total de sub-razas: <span class="badge rounded-pill text-bg-dark">${subBreedCount}</span>`;

    });

    //Agregamos el evento click al botón de reset
    document.getElementById("resetButton").addEventListener("click", (event) => {
        event.preventDefault();
        const { html: allBreedsHTML, breedCount, subBreedCount } = generateAllBreedsHTML(breeds);
        document.getElementById("dogBreeds").innerHTML = allBreedsHTML;
        document.getElementById("breedCount").innerHTML = `Total de razas: <span class="badge rounded-pill text-bg-dark">${breedCount}</span>`;
        document.getElementById("subBreedCount").innerHTML = `Total de sub-razas: <span class="badge rounded-pill text-bg-dark">${subBreedCount}</span>`;
        addClickEventsToBreeds();
    });

    //Obtenemos el input
    let searchInput = document.getElementById("searchInput");

    //Agregamos el evento de escucha para la tecla "Enter"
    searchInput.addEventListener("keyup", function (event) {
        //Número 13 es la tecla "Enter"
        if (event.keyCode === 13) {
            event.preventDefault();
            //Hacemos clic en el botón de búsqueda
            document.getElementById("searchButton").click();
        }
    });




};

fetchDogBreedsAll();




