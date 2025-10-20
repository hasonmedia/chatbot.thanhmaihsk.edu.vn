from fastapi import APIRouter, Request, HTTPException
import requests
import os
from dotenv import load_dotenv
import os

load_dotenv()  

URL = os.getenv("URL_BE")
router = APIRouter()

FB_CLIENT_ID = "762977926791763"
FB_CLIENT_SECRET = "93a66767adfd4dfa9a39127c37d9b0da"
REDIRECT_URI = f"{URL}/api/auth/facebook/callback"

@router.get("/api/auth/facebook/callback")
def facebook_callback(code: str):
    
    # 1. Đổi code sang access_token
    token_url = "https://graph.facebook.com/v21.0/oauth/access_token"
    params = {
        "client_id": FB_CLIENT_ID,
        "redirect_uri": REDIRECT_URI,
        "client_secret": FB_CLIENT_SECRET,
        "code": code
    }

    response = requests.get(token_url, params=params)
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to get access token")

    data = response.json()
    access_token = data.get("access_token")

    # 2. Lấy thông tin user (hoặc page)
    user_info_url = "https://graph.facebook.com/me/accounts"
    user_params = {
        "access_token": access_token
    }
    user_res = requests.get(user_info_url, params=user_params).json()

    return {
        "access_token": access_token,
        "user": user_res
    }


@router.get("/api/facebook/pages")
def get_pages(access_token: str):
    url = "https://graph.facebook.com/me/accounts"
    params = {
        "access_token": access_token
    }
    res = requests.get(url, params=params)
    return res.json()
