from fastapi import responses


class BadGatewayException(Exception):
    def __init__(self, message="Bad Gateway") -> None:
        self.message = message


async def handler(request, exc: BadGatewayException) -> responses.JSONResponse:

    return responses.JSONResponse(
        status_code=502,
        content={"code": 502, "message": exc.message},
    )
