from fastapi import responses


class UnauthorizedException(Exception):
    def __init__(self, message="Unauthorized") -> None:
        self.message = message


async def handler(request, exc: UnauthorizedException) -> responses.JSONResponse:

    return responses.JSONResponse(
        status_code=401,
        content={"code": 401, "message": exc.message},
    )
