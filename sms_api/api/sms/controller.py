from fastapi import Body
from fastapi import APIRouter, status, status

from api.error_handlers.schemas.bad_gateway import BadGatewayError
from api.error_handlers.schemas.unauthorized import UnauthorizedError
from api.error_handlers.schemas.not_found import NotFoundError

from api.sms.schemas.post_sms import Sms

from api.utils.remove_422 import remove_422

from api.sms.service.sms_service import SmsService


sms_router = APIRouter(
    tags=["SMS"],
    responses={
        status.HTTP_502_BAD_GATEWAY: {"model": BadGatewayError},
        status.HTTP_401_UNAUTHORIZED: {"model": UnauthorizedError},
        status.HTTP_404_NOT_FOUND: {"model": NotFoundError},
    },
)


@sms_router.post(
    path="/sms",
    status_code=status.HTTP_200_OK,
    summary="Send SMS via Twilio",
    response_model_exclude_unset=True,
)
@remove_422
async def send_sms(body: Sms = Body(...)):
    """
    Send SMS from Body:
    """
    sms_service: SmsService = SmsService()
    return await sms_service.handle_form(body)
