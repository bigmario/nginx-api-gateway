from pydantic import BaseModel


class NotFoundError(BaseModel):
    code: int
    message: str
