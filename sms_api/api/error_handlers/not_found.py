from fastapi import responses


class NotFoundException(Exception):
    def __init__(self, message="Not Found") -> None:
        self.message = message


async def handler(request, exc: NotFoundException) -> responses.JSONResponse:

    return responses.JSONResponse(
        status_code=404, content={"code": 404, "message": exc.message},
    )
