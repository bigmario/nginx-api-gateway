from pydantic import BaseModel


class UnauthorizedError(BaseModel):
    code: int
    message: str
