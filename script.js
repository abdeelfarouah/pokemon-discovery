async function fetchKantoPokemon() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const allPokemon = await response.json();
        const pokemonGrid = document.getElementById('pokemon-grid');

        // Charger tous les Pokémon en parallèle pour plus de performance
        const pokemonDetailsPromises = allPokemon.results.map(pokemon => fetch(pokemon.url).then(res => res.json()));
        const allPokemonDetails = await Promise.all(pokemonDetailsPromises);

        // Traiter chaque Pokémon
        for (const pokemonData of allPokemonDetails) {
            const item = document.createElement('div');
            item.className = 'pokemon-item';
            item.dataset.pokemonId = pokemonData.id;

            // Nom du Pokémon
            const name = document.createElement('h2');
            name.textContent = pokemonData.name;

            // Image du Pokémon
            const img = document.createElement('img');
            img.src = pokemonData.sprites.other['official-artwork'].front_default;
            img.alt = pokemonData.name;

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

            // Gestion des événements pour afficher et cacher la description
            item.addEventListener('mouseover', async () => {
                if (description.innerHTML === '') {
                    await showPokemonDescription(pokemonData, description);
                }
                description.style.display = 'block'; // Afficher la description
            });
            item.addEventListener('mouseout', () => {
                setTimeout(() => description.style.display = 'none', 300); // Laisser un léger délai avant de cacher
            });
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

