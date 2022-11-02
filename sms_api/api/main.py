from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from api.mail.controller import email_router
from api.sms.controller import sms_router


from api.utils.remove_422 import remove_422


app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sms_router)
app.include_router(email_router)


@app.get(path="/", summary="Index", tags=["Index"])
@remove_422
async def index():
    return JSONResponse(
        {
            "Framework": "FastAPI",
            "Message": "Send SMS via Twilio & Email via Fastapi-mail !!",
        }
    )
