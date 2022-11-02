from pydantic import BaseModel


class BadRequestError(BaseModel):
    code: int
    message: str
