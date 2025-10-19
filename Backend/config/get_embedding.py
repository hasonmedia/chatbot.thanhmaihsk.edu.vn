import os
import numpy as np
import google.generativeai as genai
from dotenv import load_dotenv
from openai import AsyncOpenAI
import numpy as np
import asyncio
from concurrent.futures import ThreadPoolExecutor

# Load biến môi trường
load_dotenv()

# Thread pool để chạy sync operations
thread_pool = ThreadPoolExecutor(max_workers=1)

async def get_embedding_gemini(text: str) -> np.ndarray | None:
    """
    Async version của get_embedding_gemini
    Sử dụng ThreadPoolExecutor để không block event loop
    """
    if not text or not text.strip():
        return None
    
    def _get_gemini_embedding():
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
        response = genai.embed_content(
            model="gemini-embedding-001",
            content=text
        )
        return np.array(response["embedding"], dtype=np.float32)
    
    try:
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(thread_pool, _get_gemini_embedding)
    except Exception as e:
        print(f"Error getting Gemini embedding: {e}")
        return None






async def get_embedding_chatgpt(text: str) -> np.ndarray | None:
    """
    Async version của get_embedding_chatgpt
    Sử dụng AsyncOpenAI client
    """
    if not text or not text.strip():
        return None

    try:
        client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        response = await client.embeddings.create(
            model="text-embedding-3-large",
            input=text
        )
        await client.close()
        
        if not response.data or not response.data[0].embedding:
            return None
        
        return np.array(response.data[0].embedding, dtype=np.float32)
    except Exception as e:
        print(f"Error getting ChatGPT embedding: {e}")
        return None