# apps/cognifit/services.py

import secrets
import string

import requests
from django.conf import settings

from apps.patients.models import Patient


def generate_cognifit_password():
    characters = string.ascii_letters + string.digits + "@$!%*?&"

    password = "".join(
        secrets.choice(characters)
        for _ in range(12)
    )

    return f"{password}A1!"


def register_patient_in_cognifit(patient_id):
    patient = Patient.objects.get(id=patient_id)

    if patient.cognifit_user_token:
        return patient

    password = generate_cognifit_password()

    payload = {
        "client_id": settings.COGNIFIT_CLIENT_ID,
        "client_secret": settings.COGNIFIT_CLIENT_SECRET,
        "user_name": patient.first_name,
        "user_lastname": patient.last_name,
        "user_email": patient.email,
        "user_password": password,
        "user_birthday": patient.birthday.strftime("%Y-%m-%d"),
        "user_sex": patient.sex,
        "user_locale": patient.locale,
    }

    response = requests.post(
        "https://api.cognifit.com/registration",
        json=payload,
        timeout=30,
    )

    data = response.json()

    if not response.ok:
        raise Exception(data)

    if "user_token" not in data:
        raise Exception(data)

    patient.cognifit_user_token = data["user_token"]
    patient.save(update_fields=["cognifit_user_token"])

    return patient


def get_cognifit_game_session(patient_id, game_id):
    patient = Patient.objects.get(id=patient_id)

    if not patient.cognifit_user_token:
        patient = register_patient_in_cognifit(patient.id)

    payload = {
        "client_id": settings.COGNIFIT_CLIENT_ID,
        "client_secret": settings.COGNIFIT_CLIENT_SECRET,
        "user_token": patient.cognifit_user_token,
    }

    response = requests.post(
        "https://api.cognifit.com/issue-access-token",
        json=payload,
        timeout=30,
    )

    data = response.json()

    if not response.ok:
        raise Exception(data)

    if "access_token" not in data:
        raise Exception(data)

    return {
        "patient_id": patient.id,
        "client_id": settings.COGNIFIT_CLIENT_ID,
        "access_token": data["access_token"],
        "token_type": data.get("token_type"),
        "expires": data.get("expires"),
        "expires_in": data.get("expires_in"),
        "game_id": game_id,
    }