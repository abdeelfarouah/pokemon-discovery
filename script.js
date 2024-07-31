document.getElementById('fetch-pokemon').addEventListener('click', async () => {
    const pokemonId = document.getElementById('pokemon-id').value;
    if (pokemonId < 1 || pokemonId > 151) {
        alert('Veuillez entrer un ID Pokémon valide entre 1 et 151.');
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:8080/api/pokemon/${pokemonId}`);
        if (!response.ok) {
            throw new Error('Échec de la récupération des données du Pokémon. Veuillez réessayer.');
        }

        const data = await response.json();
        if (data.error) {
            alert(data.error);
            return;
        }

        document.getElementById('pokemon-name').textContent = data.name;
        document.getElementById('pokemon-image').src = data.image_url;
        document.getElementById('pokemon-image').alt = data.name;
        document.getElementById('pokemon-description').textContent = data.description;
        
        // La caractéristique n'est plus disponible dans l'API Flask
        // Vous pouvez supprimer ou modifier cette ligne en fonction de vos besoins
        // document.getElementById('pokemon-characteristic').textContent = `Caractéristique : ${data.characteristic}`;
    } catch (error) {
        alert(error.message);
    }
});
