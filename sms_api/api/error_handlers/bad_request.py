from fastapi import responses


class BadRequestException(Exception):
    def __init__(self, message="Bad Request") -> None:
        self.message = message


async def handler(request, exc: BadRequestException) -> responses.JSONResponse:

    return responses.JSONResponse(
        status_code=400,
        content={"code": 400, "message": exc.message},
    )
