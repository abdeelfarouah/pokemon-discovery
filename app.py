from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import requests

app = Flask(__name__, static_folder='pokemon-discovery')

# Configurer CORS pour permettre toutes les origines ou spécifiez des origines précises
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

@app.route('/api/pokemon/<int:pokemon_id>', methods=['GET'])
def get_pokemon(pokemon_id):
    if (pokemon_id < 1) or (pokemon_id > 151):
        return jsonify({'error': 'Invalid Pokémon ID. Please enter a value between 1 and 151.'}), 400

    # Fetch Pokémon data
    response = requests.get(f'https://pokeapi.co/api/v2/pokemon/{pokemon_id}')
    if response.status_code != 200:
        return jsonify({'error': 'Failed to fetch Pokémon data. Please try again.'}), 500

    data = response.json()

    # Fetch Pokémon species to get the description
    species_response = requests.get(f'https://pokeapi.co/api/v2/pokemon-species/{pokemon_id}')
    if species_response.status_code != 200:
        return jsonify({'error': 'Failed to fetch Pokémon species data. Please try again.'}), 500

    species_data = species_response.json()
    description = next(
        (entry['flavor_text'] for entry in species_data['flavor_text_entries']
         if entry['language']['name'] == 'fr'),
        'No description available.'
    )

    pokemon_info = {
        'name': data['name'],
        'image_url': data['sprites']['other']['official-artwork']['front_default'],
        'description': description
    }

    return jsonify(pokemon_info)

if __name__ == '__main__':
    app.run(debug=True)

