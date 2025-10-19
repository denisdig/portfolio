
const villeMeteo = document.querySelector('.villeMeteo'); //Formulaire
const villeInput = document.querySelector('.villeInput'); // Input de la ville
const card = document.querySelector('.card'); // Partie affichage

const apiKey = 'f51ef9b0f445b35297f0345781b5bd0d'; 

villeMeteo.addEventListener('submit', async event =>{ // Event du formulaire

    event.preventDefault();
    const ville = villeInput.value;
    

    if(ville){

        try{
            const meteoInfos = await getMeteoInfos(ville);
            displayMeteoInfo(meteoInfos);

        }catch(error){
            console.log(error);
            displayError(error);
        }

    }else{
        displayError('veuillez mettre une ville')
    }
});

async function getMeteoInfos(ville){ //récupération des infos de l'api

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=${apiKey}`;
    const response = await fetch(apiUrl);

    if(!response.ok){
        throw new Error('impossible de recuperer les informations')
    }
    return await response.json();
}

function displayMeteoInfo(data){ //Affichage des infos de l'api

    const {name: city,
         main: {temp, humidity},
          weather: [{description, id}]} = data;

    card.textContent = '';
    card.style.display ='flex';

    const villeDisplay = document.createElement('h1');
    const degresDisplay = document.createElement('p');
    const humiditeDisplay = document.createElement('p');
    const descriptionDisplay = document.createElement('p');
    const emojiDisplay = document.createElement('p');

    villeDisplay.textContent = city;
                degresDisplay.textContent = `${(temp- 273.15).toFixed(1)}°C`;
    humiditeDisplay.textContent = `Humidité: ${humidity}%`;
    descriptionDisplay.textContent = description;
    emojiDisplay.textContent = getMeteoEmoji(id);

    villeDisplay.classList.add('villeDisplay');
    degresDisplay.classList.add('degresDisplay');
    humiditeDisplay.classList.add('humiditeDisplay');
    descriptionDisplay.classList.add('descriptionDisplay');
    emojiDisplay.classList.add('emojiDisplay');





    card.appendChild(villeDisplay);
    card.appendChild(degresDisplay);
    card.appendChild(humiditeDisplay);
    card.appendChild(descriptionDisplay);
    card.appendChild(emojiDisplay);


}
function getMeteoEmoji(meteoId) {
    switch (true) {
        case (meteoId >= 200 && meteoId < 300):
            return '⛈️'; // orages
        case (meteoId >= 300 && meteoId < 400):
            return '🌦️'; // bruine
        case (meteoId >= 500 && meteoId < 600):
            return '🌧️'; // pluie
        case (meteoId >= 600 && meteoId < 700):
            return '❄️'; // neige
        case (meteoId >= 700 && meteoId < 800):
            return '🌫️'; // brouillard
        case (meteoId === 800):
            return '☀️'; // ciel clair
        case (meteoId >= 801 && meteoId < 810):
            return '🌥️'; // nuages
        default:
            return '⁉️'; // inconnu
    }
}


function displayError(message){ //Message d'erreur

        const errorDisplay = document.createElement('p');
        errorDisplay.textContent = message;
        errorDisplay.classList.add('errorDisplay');

        card.textContent = "";
        card.style.display = 'flex';
        card.appendChild(errorDisplay);
}