async function fetchKantoPokemon() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const allPokemon = await response.json();
        const pokemonGrid = document.getElementById('pokemon-grid');

        // Traiter chaque Pokémon
        for (const pokemon of allPokemon.results) {
            const pokemonResponse = await fetch(pokemon.url);
            const pokemonData = await pokemonResponse.json();

            const item = document.createElement('div');
            item.className = 'pokemon-item';
            item.dataset.pokemonId = pokemonData.id; // Ajouter l'ID pour la récupération de la description

            // Nom du Pokémon
            const name = document.createElement('h2');
            name.textContent = pokemon.name;

            // Image du Pokémon
            const img = document.createElement('img');
            img.src = pokemonData.sprites.other['official-artwork'].front_default;
            img.alt = pokemon.name;

            // Type du Pokémon
            const type = document.createElement('p');
            type.textContent = `Type: ${pokemonData.types.map(t => t.type.name).join(', ')}`;

            // Description du Pokémon (initialement cachée)
            const description = document.createElement('div');
            description.className = 'pokemon-description';

            // Ajouter le nom, l'image, et le type à l'élément
            item.appendChild(img);
            item.appendChild(name);
            item.appendChild(type);
            item.appendChild(description); // Ajouter la description à l'élément

            // Ajouter l'élément à la grille
            pokemonGrid.appendChild(item);

            // Ajouter un gestionnaire de survol pour afficher la description
            item.addEventListener('mouseover', async () => {
                await showPokemonDescription(pokemonData, description);
            });
            item.addEventListener('mouseout', () => {
                description.style.display = 'none'; // Cacher la description lorsqu'on sort de la carte
            });
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

async function showPokemonDescription(pokemonData, descriptionElement) {
    // Fetch Pokémon species to get the description
    try {
        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonData.id}`);
        if (!speciesResponse.ok) {
            throw new Error('Network response was not ok');
        }
        const speciesData = await speciesResponse.json();
        const description = speciesData.flavor_text_entries.find(entry => entry.language.name === 'fr')?.flavor_text || 'No description available.';

        descriptionElement.innerHTML = `
            <h2>${pokemonData.name}</h2>
            <img src="${pokemonData.sprites.other['official-artwork'].front_default}" alt="${pokemonData.name}" style="width: 150px; height: 150px;">
            <p>${description}</p>
            <p><strong>Types:</strong> ${pokemonData.types.map(t => t.type.name).join(', ')}</p>
        `;
        descriptionElement.style.display = 'block'; // Afficher la description
    } catch (error) {
        descriptionElement.innerHTML = `<p>There was a problem fetching the description: ${error.message}</p>`;
    }
}

// Appel de la fonction pour charger les Pokémon lorsque la page est prête
window.onload = fetchKantoPokemon;
