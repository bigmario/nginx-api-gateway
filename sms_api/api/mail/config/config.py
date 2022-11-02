import os
from pydantic import BaseSettings


class Settings(BaseSettings):
    twilio_account_sid: str
    twilio_auth_token: str
    twilio_phone_number: str

    mail_username: str
    mail_password: str
    mail_from: str
    mail_to: str
    mail_port: str
    mail_server: str
    mail_from_name: str
    mail_use_tls: bool
    mail_use_ssl: bool

    class Config:
        env_file = f"{os.getcwd()}/api/.env"
