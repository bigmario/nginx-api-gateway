from pydantic import BaseModel, Field, EmailStr
from typing import List


class MailBody(BaseModel):
    name: str = Field(...)
    number: str = Field(...)
    message: str = Field(...)
    mail: EmailStr = Field(...)


class Email(BaseModel):
    subject: str = Field(...)
    body: MailBody
