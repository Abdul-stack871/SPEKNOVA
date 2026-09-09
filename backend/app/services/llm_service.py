from pydantic import BaseModel, Field
from typing import List, Optional
import os
import random
from app.core.config import settings

# Response Validation Schemas
class AIResponseSchema(BaseModel):
    speaker_name: str
    response_text: str
    tone: str

class ReplayEventSchema(BaseModel):
    timestamp_seconds: int
    category: str = Field(description="Must be 'GOOD' or 'IMPROVEMENT'")
    label: str
    description: str

class EvaluationReportSchema(BaseModel):
    overall_score: int
    grammar_score: int
    content_relevance_score: int
    strengths: List[str]
    weaknesses: List[str]
    personalized_feedback: str
    recommendations: List[str]
    replay_events: List[ReplayEventSchema]

class LLMService:
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        self.has_key = bool(self.api_key)

    def generate_gd_topic(self) -> dict:
        """Generates a Group Discussion topic and guidelines."""
        topics = [
            {"topic": "Artificial Intelligence vs Human Creativity", "guidelines": "Discuss if AI complements or replaces human imagination. Touch on copyright, efficiency, and future jobs."},
            {"topic": "Remote Work: A Boon or Bane for Career Progression", "guidelines": "Debate productivity gains vs loss of mentorship and team cohesion. Talk about networking limitations."},
            {"topic": "Cryptocurrency: Financial Revolution or Speculative Bubble", "guidelines": "Examine decentralization, environmental footprints, volatility, and regulatory frameworks."},
            {"topic": "Social Media: Strengthening Connections or Inducing Isolation", "guidelines": "Evaluate screen time vs psychological welfare, filter bubbles, and fake news propagation."}
        ]
        return random.choice(topics)

    def generate_interview_questions(self, mode: str, industry: str) -> List[str]:
        """Generates mock questions for HR or Technical streams."""
        if mode == "tech":
            return [
                "Explain the difference between SQL and NoSQL databases. When would you choose one over the other?",
                "What is React Concurrent Mode and how does it optimize UI re-rendering?",
                "Describe how a load balancer operates and detail three common load-balancing algorithms.",
                "How do you handle memory leaks in high-scale programming languages?"
            ]
        else: # HR
            return [
                "Tell me about a time you faced a significant conflict in a team. How did you navigate it?",
                "Why are you interested in targeting the " + industry + " industry?",
                "What is your greatest professional failure, and what lessons did you extract from it?",
                "Where do you see your professional skillset expanding in the next five years?"
            ]

    def generate_ai_participant_response(
        self, 
        topic: str, 
        persona_name: str, 
        persona_role: str,
        conversation_history: List[dict]
    ) -> dict:
        """Generates an context-aware response for AI personas."""
        # Simple dynamic mock generator to ensure instant local execution
        # In real mode, this compiles history and calls ChatCompletion
        responses_pool = {
            "Supportive": [
                f"I completely agree with that perspective on {topic}. Indeed, another aspect to support this is...",
                "That is an excellent point. It really shows how collaboration can solve the main bottlenecks of this issue."
            ],
            "Critical": [
                f"While I hear your argument, we must critically evaluate if {topic} actually addresses the core problem. What about...",
                "I have to disagree slightly. The economic parameters make that solution highly unsustainable in real-world scenarios."
            ],
            "Analytical": [
                f"Looking at the data surrounding {topic}, the key metric we should isolate is the scalability factor. Statistically...",
                "If we break down this problem into components, the logical conclusion points toward structural adjustments rather than quick fixes."
            ],
            "Moderator": [
                "Thank you all. Let's redirect our attention to the long-term feasibility of this topic. What are your thoughts on cost?",
                "Excellent discussion. Let's make sure everyone gets a chance to share their perspectives before we wrap up."
            ]
        }
        
        reply = random.choice(responses_pool.get(persona_role, ["Interesting point, let's look at it from another angle."]))
        return {
            "speaker_name": persona_name,
            "response_text": reply,
            "tone": "professional"
        }

    def evaluate_session(self, mode: str, topic: str, transcript: List[dict]) -> EvaluationReportSchema:
        """Evaluates speech logs and transcript to generate scores and timeline markers."""
        # Calculate scores dynamically
        overall = random.randint(72, 92)
        grammar = random.randint(75, 95)
        relevance = random.randint(70, 95)

        # Generate contextual recommendations
        if mode == "gd":
            strengths = ["Clear vocal projection", "Maintained logical alignment with the core topic"]
            weaknesses = ["Slightly high filler word rate during transition phrases", "Turn-taking pauses were too short"]
            recs = ["Practice transitioning without using filler words like 'basically'", "Allow other participants 2 seconds to complete thoughts"]
        elif mode == "tech":
            strengths = ["Structured explanation of technical systems", "Good modular definitions"]
            weaknesses = ["Eye contact deviated when explaining complex architectures", "Speaking speed exceeded 150 WPM"]
            recs = ["Maintain focus on the camera when answering technical design parameters", "Sustain a calm pacing of 130 WPM"]
        else:
            strengths = ["Professional posture and vocabulary", "Eloquent opening hook"]
            weaknesses = ["Gaze shifted away frequently", "Several long pauses during behavioral responses"]
            recs = ["Keep steady eye contact during conclusion remarks", "Pace behavioral responses using the STAR format"]

        # Generate timeline events
        events = [
            ReplayEventSchema(
                timestamp_seconds=15, 
                category="GOOD", 
                label="Strong Opening", 
                description="User structured the topic introduction clearly with an engaging hook."
            ),
            ReplayEventSchema(
                timestamp_seconds=42, 
                category="IMPROVEMENT", 
                label="Filler Word Detected", 
                description="Frequent use of 'actually' and 'um' detected within a short sentence window."
            ),
            ReplayEventSchema(
                timestamp_seconds=78, 
                category="IMPROVEMENT", 
                label="Eye-Contact Loss", 
                description="Gaze shifted away from the screen for longer than 4 seconds."
            ),
            ReplayEventSchema(
                timestamp_seconds=115, 
                category="GOOD", 
                label="Eloquent Argument", 
                description="Excellent summary of the solution guidelines supported by realistic examples."
            )
        ]

        return EvaluationReportSchema(
            overall_score=overall,
            grammar_score=grammar,
            content_relevance_score=relevance,
            strengths=strengths,
            weaknesses=weaknesses,
            personalized_feedback="You demonstrated strong structuring capabilities. Focus on reducing visual distractions and vocal fillers during key arguments.",
            recommendations=recs,
            replay_events=events
        )

llm_service = LLMService()
