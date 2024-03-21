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
        <a href="#" class="list-group-item list-group-item-action list-group-item-success d-flex py-3" aria-current="true">
        <div class="d-flex w-100 justify-content-between">
            <div>
                <span class="mb-2 fw-bold" style="text-transform: uppercase;">${breed}</span>`;
        let subBreeds = breeds[breed];

        //Si la raza tiene sub-razas, iterar sobre ellas
        if (subBreeds.length > 0) {
            html += `<hr><strong>Sub-razas:</strong>`;
            for (let subBreed of subBreeds) {
                html += `<p style= "text-align: left;">• ${subBreed}</p>`;
                subBreedCount++;
            }
            
        }
        html += `</div></div></a>`;
        breedCount++;
    }
    return {html, breedCount, subBreedCount};
};

//Función principal
const fetchDogBreedsAll = async () => {
    const breeds = await getDogBreeds();
    const  {html, breedCount, subBreedCount} = generateHTML(breeds);

    //Mostramos los resultados en la vista HTML
    document.getElementById("dogBreeds").innerHTML = html;
    document.getElementById("breedCount").innerHTML = `Total de razas: <span class="badge rounded-pill text-bg-dark">${breedCount}</span>`;
    document.getElementById("subBreedCount").innerHTML = `Total de sub-razas: <span class="badge rounded-pill text-bg-dark">${subBreedCount}</span>`;
};

fetchDogBreedsAll();
