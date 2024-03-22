//Función para obtener las razas y sub-razas de perros
const getDogBreeds = async () => {
    const response = await fetch("https://dog.ceo/api/breeds/list/all");
    const data = await response.json();
    return data.message;
};

//Función para generar el HTML de lista para las razas  y sub-razas de los perros
const generateHTML = (breeds) => {
    let html = "";
    let breedCount = 0;
    let subBreedCount = 0;

    //Iteramos sobre cada raza
    for (let breed in breeds) {
        html += `
        <div class="d-flex w-100 list-group-item list-group-item-action list-group-item-success d-flex py-3">
            <div>
            <a href="#" class="breed text-decoration-none text-success" data-breed="${breed}" aria-current="true" data-bs-toggle="modal" data-bs-target="#dogModal"><span class="mb-2 fw-bold" style="text-transform: uppercase;">${breed}</span></a>`;
        let subBreeds = breeds[breed];

        //Si la raza tiene sub-razas, iterar sobre ellas
        if (subBreeds.length > 0) {
            html += `<hr><strong>Sub-razas:</strong>`;
            for (let subBreed of subBreeds) {
                html += `<a href="#" class="subBreed text-decoration-none text-success" data-breed="${breed}" data-subBreed="${subBreed}" data-bs-toggle="modal" data-bs-target="#dogModal"><p style= "text-align: left;">• ${subBreed}</p>`;
                subBreedCount++;
            }
        }
        html += `</div></div>`;
        breedCount++;
    }
    return { html, breedCount, subBreedCount };
};

//Función principal
const fetchDogBreedsAll = async () => {
    const breeds = await getDogBreeds();
    const { html, breedCount, subBreedCount } = generateHTML(breeds);

    //Mostramos los resultados en la vista HTML
    document.getElementById("dogBreeds").innerHTML = html;
    document.getElementById(
        "breedCount"
    ).innerHTML = `Total de razas: <span class="badge rounded-pill text-bg-dark">${breedCount}</span>`;
    document.getElementById(
        "subBreedCount"
    ).innerHTML = `Total de sub-razas: <span class="badge rounded-pill text-bg-dark">${subBreedCount}</span>`;

    //Agregamos el evento click a cada raza y subraza
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

            const response = await fetch(url);
            const data = await response.json();

            document.getElementById("dogImage").src = data.message;
        });
    });
};

fetchDogBreedsAll();



