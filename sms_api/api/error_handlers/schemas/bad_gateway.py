from pydantic import BaseModel


class BadGatewayError(BaseModel):
    code: int
    message: str
