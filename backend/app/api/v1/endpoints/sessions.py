from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Dict
from app.core.auth import get_current_user
from app.services.llm_service import llm_service, EvaluationReportSchema
from app.services.speech_analyzer import speech_analyzer
import uuid

router = APIRouter()

# Temporary in-memory session database to guarantee instant run support without active database connections
SESSIONS_DB: Dict[str, dict] = {}

class SessionInitSchema(BaseModel):
    mode: str
    topic: str
    duration_seconds: float
    transcript_text: str
    eye_contact_percentage: int

@router.post("/", response_model=EvaluationReportSchema)
def create_practice_session(
    payload: SessionInitSchema, 
    current_user: dict = Depends(get_current_user)
):
    """
    Submits completed practice session data, evaluates content using AI engine, 
    calculates metrics, and saves the report.
    """
    # Run speech evaluations
    audio_metrics = speech_analyzer.analyze_text(
        payload.transcript_text, 
        payload.duration_seconds
    )
    
    # Run conversation LLM evaluations
    mock_history = [{"role": "user", "content": payload.transcript_text}]
    report = llm_service.evaluate_session(
        mode=payload.mode,
        topic=payload.topic,
        transcript=mock_history
    )
    
    session_id = str(uuid.uuid4())
    
    # Store complete session report details
    session_data = {
        "id": session_id,
        "user_id": current_user.get("sub"),
        "mode": payload.mode,
        "topic": payload.topic,
        "duration_seconds": payload.duration_seconds,
        "metrics": {
            "eye_contact_percentage": payload.eye_contact_percentage,
            "words_per_minute": audio_metrics["words_per_minute"],
            "filler_words_count": audio_metrics["filler_words_count"],
            "pauses_count": audio_metrics["pauses_count"],
            "grammar_score": report.grammar_score,
            "content_relevance_score": report.content_relevance_score
        },
        "report": report.model_dump()
    }
    
    SESSIONS_DB[session_id] = session_data
    return report

@router.get("/history")
def get_session_history(current_user: dict = Depends(get_current_user)):
    """
    Retrieves list of past practice sessions for the logged-in user.
    """
    user_id = current_user.get("sub")
    history = []
    for s_id, s_data in SESSIONS_DB.items():
        if s_data["user_id"] == user_id:
            history.append({
                "id": s_id,
                "mode": s_data["mode"],
                "topic": s_data["topic"],
                "duration_seconds": s_data["duration_seconds"],
                "overall_score": s_data["report"]["overall_score"],
                "eye_contact_percentage": s_data["metrics"]["eye_contact_percentage"]
            })
    return history

@router.get("/{session_id}")
def get_session_details(session_id: str, current_user: dict = Depends(get_current_user)):
    """
    Returns full evaluation details and timeline markers for a session.
    """
    if session_id not in SESSIONS_DB:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    return SESSIONS_DB[session_id]
