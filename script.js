// Fonction pour obtenir un Pokémon par son ID
async function fetchPokemonById(pokemonId) {
    if (pokemonId < 1 || pokemonId > 151) {
        alert('Veuillez entrer un ID valide (1-151).');
        return;
    }

    try {
        // Récupération des informations de base du Pokémon
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        if (!response.ok) {
            throw new Error('Problème lors de la récupération des données du Pokémon.');
        }
        const pokemonData = await response.json();

        // Récupération des informations sur l'espèce du Pokémon pour la description
        const speciesResponse = await fetch(pokemonData.species.url);
        if (!speciesResponse.ok) {
            throw new Error('Problème lors de la récupération des informations sur l\'espèce.');
        }
        const speciesData = await speciesResponse.json();

        // Sélection de la description en français (ou autre langue si non disponible)
        const descriptionEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'fr');
        const description = descriptionEntry ? descriptionEntry.flavor_text : 'Description non disponible en français.';

        // Affichage des informations dans l'interface
        document.getElementById('pokemon-name').textContent = pokemonData.name;
        document.getElementById('pokemon-image').src = pokemonData.sprites.other['official-artwork'].front_default;
        document.getElementById('pokemon-description').textContent = description;
        document.getElementById('pokemon-characteristic').textContent = `Type: ${pokemonData.types.map(t => t.type.name).join(', ')}`;
    } catch (error) {
        console.error('Erreur :', error.message);
        document.getElementById('pokemon-description').textContent = "Erreur lors de la récupération du Pokémon.";
    }
}

// Ajout de l'écouteur d'événement sur le bouton
document.getElementById('fetch-pokemon').addEventListener('click', () => {
    const pokemonId = parseInt(document.getElementById('pokemon-id').value, 10);
    if (pokemonId) {
        fetchPokemonById(pokemonId);
    } else {
        alert('Veuillez entrer un ID valide.');
    }
});
