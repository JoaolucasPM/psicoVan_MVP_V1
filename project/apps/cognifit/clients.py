import requests
from django.conf import settings


def create_cognifit_user(data):
    url = "https://api.cognifit.com/registration"

    payload = {
        "client_id": settings.COGNIFIT_CLIENT_ID,
        "client_secret": settings.COGNIFIT_CLIENT_SECRET,
        "user_name": data["first_name"],
        "user_lastname": data["last_name"],
        "user_email": data["email"],
        "user_birthday": data["birthday"],
        "user_sex": data["sex"],
        "user_locale": data["locale"],
    }

    response = requests.post(url, json=payload)

    response.raise_for_status()

    return response.json()