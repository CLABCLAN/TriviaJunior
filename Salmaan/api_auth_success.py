import logging

# Configureer logging om berichten in de console te zien
logging.basicConfig(level=logging.INFO)

# Simulatie van de geheime sleutel (moet overeenkomen met de client app)
GELDIGE_API_SLEUTEL: str = "TRIVIA_Junior_APP_GROEPSPROJECT123"
HEADER_NAAM: str = 'X-API-KEY' 

def controleer_authenticatie(request_headers: dict) -> bool:
    """
    Controleert de inkomende request headers op een geldige API Key.
    Deze functie is de poortwachter voor elk API endpoint.
    """
    
    # Zoek de sleutel op een case-insensitieve manier
    sleutel_gevonden = request_headers.get(HEADER_NAAM) or request_headers.get(HEADER_NAAM.lower())

    # 1. Sleutel ontbreekt (FAALT)
    if not sleutel_gevonden:
        logging.warning("Authenticatie MISLUKT: Header '%s' ontbreekt.", HEADER_NAAM)
        return False
    
    # 2. Sleutel onjuist (FAALT)
    if sleutel_gevonden != GELDIGE_API_SLEUTEL:
        logging.error("Authenticatie MISLUKT: Ongeldige sleutel ingezonden.")
        return False
        
    # 3. Sleutel correct (SUCCES)
    logging.info("Toegang verleend. Authenticatie GESLAAGD.")
    return True
