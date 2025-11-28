from flask import Flask, request, jsonify
from api_auth_success import controleer_authenticatie
import logging
# BELANGRIJK: We importeren CORS om beveiligingsfouten in de browser te voorkomen (nodig voor Fetch API)
from flask_cors import CORS 

# Configureer Flask en logging
app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

# Schakel CORS in om communicatie tussen JavaScript (lokaal) en de server (5000) toe te staan
CORS(app) 

# In een echt project zou dit uit een database komen.
# We gebruiken hier een simpele lijst om scores te loggen.
scores_opgeslagen = []
score_id_teller = 1

@app.route('/api/save_score', methods=['POST'])
def save_score():
    """
    API Endpoint om de score van de Animal Quiz op te slaan.
    Vereist een geldige API Key in de headers.
    Data wordt verstuurd via JSON: {"score": 5, "total_questions": 30, ...}
    """
    global score_id_teller
    
    # === POORTWACHTER: AUTHENTICATIE CHECK ===
    # Dit controleert de 'X-API-KEY' header
    if not controleer_authenticatie(request.headers):
        return jsonify({"fout": "Toegang geweigerd. Ongeldige API Sleutel."}), 401
    
    # === TOEGANG VERLEEND LOGICA ===
    try:
        data = request.get_json()
        
        # Haal de noodzakelijke data uit de JSON payload
        final_score = data.get('score')
        total = data.get('total_questions')
        quiz_naam = data.get('quiz_name', 'Onbekend')
        
        if final_score is None or total is None:
            return jsonify({"fout": "Score of totaal aantal vragen ontbreekt."}), 400

        # Simuleer opslag in database
        nieuwe_score = {
            "id": score_id_teller,
            "quiz": quiz_naam,
            "score": final_score,
            "totaal": total,
            "timestamp": data.get('timestamp')
        }
        scores_opgeslagen.append(nieuwe_score)
        score_id_teller += 1

        logging.info(f"SCORE OPGESLAGEN: Quiz: {quiz_naam}, Score: {final_score}/{total}")
        
        # Stuur een bevestiging terug naar JavaScript
        return jsonify({
            "status": "succes",
            "message": "Score opgeslagen",
            "id": nieuwe_score['id'],
            "score_ontvangen": f"{final_score}/{total}"
        }), 200

    except Exception as e:
        logging.error(f"Fout bij het verwerken van POST-verzoek: {e}")
        return jsonify({"fout": "Interne serverfout bij verwerking van data."}), 500

# --- De oorspronkelijke /api/vragen GET-functie is verwijderd ---

if __name__ == '__main__':
    print("--- SCORE SERVER GESTART ---")
    print("Luistert naar: POST http://127.0.0.1:5000/api/save_score")
    print("Vergeet niet de X-API-KEY header mee te sturen!")
    app.run(debug=True)
    