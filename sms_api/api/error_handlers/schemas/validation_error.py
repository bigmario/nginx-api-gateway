from pydantic import BaseModel


class CustomValidationError(BaseModel):
    code: int
    message: str
