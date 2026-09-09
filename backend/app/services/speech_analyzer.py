import re
from typing import Dict, List

class SpeechAnalyzer:
    def __init__(self):
        # Compiled regex for standard vocal filler indicators
        self.filler_pattern = re.compile(
            r'\b(um|uh|like|basically|actually|you know|so|mean)\b', 
            re.IGNORECASE
        )

    def analyze_text(self, text: str, duration_seconds: float) -> Dict[str, int]:
        """
        Analyzes a segment of spoken text to calculate pacing (words per minute)
        and detect counts of classic filler indicators.
        """
        if not text:
            return {
                "word_count": 0,
                "words_per_minute": 0,
                "filler_words_count": 0,
                "pauses_count": 0
            }

        # Calculate word counts
        words = text.split()
        word_count = len(words)
        
        # Calculate WPM pacing
        duration_minutes = duration_seconds / 60.0 if duration_seconds > 0 else 1.0
        wpm = int(word_count / duration_minutes)

        # Detect fillers
        fillers = self.filler_pattern.findall(text)
        filler_count = len(fillers)

        # Pause approximations - counting trailing sentence punctuations or ellipses
        pauses = len(re.findall(r'(\.\.\.|\,|\.|\?| - )', text))

        return {
            "word_count": word_count,
            "words_per_minute": wpm,
            "filler_words_count": filler_count,
            "pauses_count": max(pauses, filler_count // 2)
        }

speech_analyzer = SpeechAnalyzer()
