import gspread
from google.oauth2.service_account import Credentials
from config.get_embedding import get_embedding_chatgpt, get_embedding_gemini
from models.knowledge_base import DocumentChunk
from config.database import AsyncSessionLocal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete, select
import json
from langchain.text_splitter import RecursiveCharacterTextSplitter
import asyncio
from concurrent.futures import ThreadPoolExecutor

# Thread pool để chạy sync operations
thread_pool = ThreadPoolExecutor(max_workers=1)


async def insert_chunks(chunks_data: list):
    async with AsyncSessionLocal() as session:
        try:
            # Chèn từng record một
            for d in chunks_data:
                chunk = DocumentChunk(
                    chunk_text=str(d['chunk_text']),
                    search_vector=d.get('search_vector'), 
                    knowledge_base_id=d['knowledge_base_id']
                )
                session.add(chunk)
                await session.commit()  # commit ngay sau mỗi record
        except Exception as e:
            print(e)
            await session.rollback()
            raise


async def get_sheet(sheet_id: str, id: int):
    scopes = [
        'https://www.googleapis.com/auth/spreadsheets'
    ]
    
    async with AsyncSessionLocal() as session:
        # Xóa tất cả dữ liệu cũ
        await session.execute(delete(DocumentChunk))
        await session.commit()  # commit để xác nhận bảng trống
    
    creds = Credentials.from_service_account_file('/app/config_sheet.json', scopes=scopes)
    
    def _get_sheet_data():
        """Sync function để chạy trong thread pool"""
        client = gspread.authorize(creds)
        workbook = client.open_by_key(sheet_id)
        worksheets = workbook.worksheets()
        
        all_records = []
        for sheet in worksheets:
            records = sheet.get_all_records()
            all_records.extend(records)
        
        return all_records, len(worksheets)
    
    # Chạy sync operations trong thread pool
    loop = asyncio.get_event_loop()
    all_records, sheets_count = await loop.run_in_executor(thread_pool, _get_sheet_data)

    all_chunks = []

    for row in all_records:
        # Biến row thành JSON string
        row_str = "{ " + ",".join(
            [f"\"{k}\":\"{v}\"" for k, v in row.items() if v not in ("", None)]
        ) + " }"

        # Nếu hàng quá dài, mới chunk, không cần overlap nhiều
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,   # nhỏ hơn chunk size trước
            chunk_overlap=0   # tránh trộn hàng khác
        )
        row_chunks = splitter.split_text(row_str)
        all_chunks.extend(row_chunks)

    # Tạo vector và lưu
    for chunk in all_chunks:
        vector = await get_embedding_chatgpt(chunk)
        await insert_chunks([{
            "chunk_text": chunk,
            "search_vector": vector.tolist(),
            "knowledge_base_id": id
        }])
    
    return {
        "success": True,
        "message": f"Đã xử lý {len(all_chunks)} chunks từ Google Sheet",
        "chunks_created": len(all_chunks),
        "sheets_processed": sheets_count
    }
    
        
        
    