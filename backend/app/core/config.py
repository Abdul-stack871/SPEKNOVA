from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "SpekNova API"
    API_V1_STR: str = "/api/v1"
    
    # Supabase (Database/Auth) Configuration
    SUPABASE_URL: Optional[str] = None
    SUPABASE_ANON_KEY: Optional[str] = None
    SUPABASE_JWT_SECRET: Optional[str] = None
    
    # LLM Settings (OpenAI / Gemini / Anthropic)
    OPENAI_API_KEY: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
