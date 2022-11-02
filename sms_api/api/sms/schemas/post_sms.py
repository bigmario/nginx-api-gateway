from pydantic import BaseModel, Field


class Sms(BaseModel):
    to: str = Field(...)
    body: str = Field(...)

