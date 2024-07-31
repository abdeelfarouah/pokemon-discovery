from waitress import serve
from app import app  # Assurez-vous que `app` est importé correctement

if __name__ == "__main__":
    serve(app, host='0.0.0.0', port=5000)
