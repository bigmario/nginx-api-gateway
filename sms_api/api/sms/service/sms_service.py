import asyncio
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
from api.sms.config import config

import logging

from api.sms.schemas.post_sms import Sms

from fastapi.responses import JSONResponse
from fastapi import status


settings = config.Settings()


class SmsService:
    def send_sms(self, body: Sms):
        try:
            logging.basicConfig()
            success = {"code": 200, "message": "SMS Sent Successfully"}
            client = Client(settings.twilio_account_sid, settings.twilio_auth_token)
            client.http_client.logger.setLevel(logging.INFO)
            client.messages.create(
                from_=settings.twilio_phone_number, to=body.to, body=body.body
            )
            return success
        except TwilioRestException as e:
            failure = {"code": 400, "message": f"Can't send SMS - {e}"}
            return failure

    async def handle_form(self, body: Sms):
        result = await asyncio.get_event_loop().run_in_executor(
            None, self.send_sms, body
        )
        if result["code"] == 200:
            return JSONResponse(result, status_code=status.HTTP_200_OK)
        else:
            return JSONResponse(result, status_code=status.HTTP_400_BAD_REQUEST)
