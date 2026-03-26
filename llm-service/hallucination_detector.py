# """
# Hallucination Detection using Entailment Checking
# """

# from transformers import pipeline
# import re

# class HallucinationDetector:
#     def __init__(self):
#         # Use NLI model for entailment checking
#         self.nli_model = pipeline(
#             "text-classification",
#             model="microsoft/deberta-v3-base-mnli-fever-anli",
#             device=0 if torch.cuda.is_available() else -1
#         )
    
#     def check_entailment(self, premise, hypothesis):
#         """
#         Check if hypothesis is entailed by premise
#         Returns: entailment score (0-1)
#         """
#         result = self.nli_model(f"{premise} [SEP] {hypothesis}")[0]
        
#         if result['label'] == 'ENTAILMENT':
#             return result['score']
#         else:
#             return 0.0
    
#     def extract_claims(self, text):
#         """Extract individual claims from generated text"""
#         # Split by sentences
#         sentences = re.split(r'[.!?]+', text)
#         claims = [s.strip() for s in sentences if len(s.strip()) > 10]
#         return claims
    
#     def detect_hallucinations(self, generated_answer, retrieved_context):
#         """
#         Detect hallucinations in generated answer
#         Returns: list of (claim, entailment_score, is_hallucination)
#         """
#         # Combine context
#         full_context = " ".join([chunk['text'] for chunk in retrieved_context])
        
#         # Extract claims from answer
#         claims = self.extract_claims(generated_answer)
        
#         results = []
#         for claim in claims:
#             score = self.check_entailment(full_context, claim)
#             is_hallucination = score < 0.5  # Threshold
#             results.append({
#                 'claim': claim,
#                 'entailment_score': score,
#                 'is_hallucination': is_hallucination
#             })
        
#         return results
    
#     def get_hallucination_report(self, results):
#         """Generate hallucination report"""
#         total_claims = len(results)
#         hallucinations = [r for r in results if r['is_hallucination']]
        
#         report = {
#             'total_claims': total_claims,
#             'hallucinated_claims': len(hallucinations),
#             'hallucination_rate': len(hallucinations) / total_claims if total_claims > 0 else 0,
#             'hallucinations': hallucinations
#         }
        
#         return report

# # Integrate with RAG
# class SafeRAG(LegalRAG):
#     def __init__(self, *args, **kwargs):
#         super().__init__(*args, **kwargs)
#         self.hallucination_detector = HallucinationDetector()
    
#     def answer_query_safe(self, query, top_k=5):
#         """RAG with hallucination detection"""
#         # Get RAG answer
#         result = self.answer_query(query, top_k)
        
#         # Detect hallucinations
#         chunks = self.retrieve(query, top_k)
#         hallucination_results = self.hallucination_detector.detect_hallucinations(
#             result['answer'],
#             chunks
#         )
        
#         # Add hallucination report
#         result['hallucination_report'] = self.hallucination_detector.get_hallucination_report(hallucination_results)
        
#         # Warn if high hallucination rate
#         if result['hallucination_report']['hallucination_rate'] > 0.3:
#             result['warning'] = "⚠️ High hallucination rate detected. Please verify answer with cited sources."
        
#         return result

"""
Hallucination Detection for Legal RAG System
Detects when the model generates unsupported claims
"""

import torch
from transformers import pipeline
import re
import json
from typing import List, Dict

class HallucinationDetector:
    def __init__(self, use_gpu=True):
        """
        Initialize hallucination detector with NLI model
        
        Uses Natural Language Inference to check if generated claims
        are supported by the retrieved context
        """
        print("🔄 Loading hallucination detection model...")
        
        device = 0 if use_gpu and torch.cuda.is_available() else -1
        
        # Load NLI model for entailment checking
        try:
            self.nli_model = pipeline(
                "text-classification",
                model="microsoft/deberta-v3-base-mnli-fever-anli",
                device=device
            )
            print("✅ Hallucination detector loaded")
        except Exception as e:
            print(f"⚠️  Could not load DeBERTa model, using simpler alternative: {e}")
            # Fallback to smaller model
            self.nli_model = pipeline(
                "text-classification",
                model="cross-encoder/nli-deberta-v3-small",
                device=device
            )
            print("✅ Fallback hallucination detector loaded")
    
    def check_entailment(self, premise: str, hypothesis: str) -> float:
        """
        Check if hypothesis is entailed by premise
        
        Args:
            premise: The retrieved context (evidence)
            hypothesis: The generated claim to verify
            
        Returns:
            entailment score (0-1), higher means more supported
        """
        try:
            # Create input for NLI model
            result = self.nli_model(f"{premise} [SEP] {hypothesis}")[0]
            
            # Check if entailed
            if result['label'].upper() in ['ENTAILMENT', 'ENTAILED']:
                return result['score']
            elif result['label'].upper() == 'NEUTRAL':
                return result['score'] * 0.5  # Partial support
            else:  # CONTRADICTION
                return 0.0
                
        except Exception as e:
            print(f"⚠️  Entailment check failed: {e}")
            return 0.5  # Default to uncertain
    
    def extract_claims(self, text: str) -> List[str]:
        """
        Extract individual factual claims from generated text
        
        Args:
            text: Generated answer text
            
        Returns:
            List of individual claims
        """
        # Remove citations like [1], [2], etc.
        text = re.sub(r'\[\d+\]', '', text)
        
        # Split by sentence boundaries
        sentences = re.split(r'[.!?]+', text)
        
        # Filter out very short sentences and clean up
        claims = []
        for s in sentences:
            s = s.strip()
            # Skip very short claims, questions, or meta-statements
            if len(s) < 15:
                continue
            if s.startswith(('According to', 'As per', 'The', 'Section', 'Article')):
                claims.append(s)
            elif any(keyword in s.lower() for keyword in ['shall', 'must', 'penalty', 'fine', 'required', 'prohibited']):
                claims.append(s)
        
        return claims
    
    def detect_hallucinations(
        self, 
        generated_answer: str, 
        retrieved_chunks: List[Dict],
        threshold: float = 0.5
    ) -> List[Dict]:
        """
        Detect hallucinations in generated answer
        
        Args:
            generated_answer: The text generated by the model
            retrieved_chunks: List of retrieved context chunks
            threshold: Minimum score for claim to be considered supported
            
        Returns:
            List of dictionaries with claim analysis
        """
        # Combine all context
        full_context = " ".join([
            chunk.get('text', '') 
            for chunk in retrieved_chunks
        ])
        
        # Extract claims from answer
        claims = self.extract_claims(generated_answer)
        
        if not claims:
            return []
        
        # Check each claim
        results = []
        for claim in claims:
            score = self.check_entailment(full_context, claim)
            
            results.append({
                'claim': claim,
                'entailment_score': score,
                'is_supported': score >= threshold,
                'is_hallucination': score < threshold,
                'confidence': 'high' if score > 0.7 else 'medium' if score > 0.4 else 'low'
            })
        
        return results
    
    def get_hallucination_report(self, results: List[Dict]) -> Dict:
        """
        Generate comprehensive hallucination report
        
        Args:
            results: Output from detect_hallucinations()
            
        Returns:
            Dictionary with hallucination statistics
        """
        if not results:
            return {
                'total_claims': 0,
                'supported_claims': 0,
                'hallucinated_claims': 0,
                'hallucination_rate': 0.0,
                'average_confidence': 0.0,
                'hallucinations': [],
                'low_confidence_claims': []
            }
        
        total_claims = len(results)
        hallucinations = [r for r in results if r['is_hallucination']]
        supported = [r for r in results if r['is_supported']]
        low_confidence = [r for r in results if r['confidence'] == 'low']
        
        avg_score = sum(r['entailment_score'] for r in results) / total_claims
        
        report = {
            'total_claims': total_claims,
            'supported_claims': len(supported),
            'hallucinated_claims': len(hallucinations),
            'hallucination_rate': len(hallucinations) / total_claims,
            'average_confidence': avg_score,
            'hallucinations': hallucinations,
            'low_confidence_claims': low_confidence
        }
        
        return report
    
    def print_report(self, report: Dict):
        """Pretty print hallucination report"""
        print("\n" + "="*70)
        print("📊 HALLUCINATION DETECTION REPORT")
        print("="*70)
        print(f"Total Claims: {report['total_claims']}")
        print(f"Supported Claims: {report['supported_claims']}")
        print(f"Hallucinated Claims: {report['hallucinated_claims']}")
        print(f"Hallucination Rate: {report['hallucination_rate']:.1%}")
        print(f"Average Confidence: {report['average_confidence']:.2f}")
        
        if report['hallucinations']:
            print("\n⚠️  Unsupported Claims:")
            for i, h in enumerate(report['hallucinations'], 1):
                print(f"\n  {i}. {h['claim']}")
                print(f"     Score: {h['entailment_score']:.2f}")
        
        if report['low_confidence_claims']:
            print("\n⚠️  Low Confidence Claims:")
            for i, c in enumerate(report['low_confidence_claims'], 1):
                print(f"\n  {i}. {c['claim']}")
                print(f"     Score: {c['entailment_score']:.2f}")
        
        print("="*70)


# Test the detector
def test_hallucination_detector():
    """Test hallucination detection with examples"""
    
    detector = HallucinationDetector()
    
    # Example 1: Well-supported answer
    context1 = [{
        'text': "Section 135 of the Securities Act, 2015 states that insider trading "
                "shall be punishable with imprisonment for a term which may extend to "
                "ten years, or with a fine which may extend to three times the profit gained."
    }]
    
    answer1 = """According to Section 135 of the Securities Act, 2015, insider trading 
    is punishable with imprisonment up to ten years or a fine up to three times the profit."""
    
    # Example 2: Answer with hallucination
    context2 = [{
        'text': "The Banking Companies Ordinance, 1962 requires banks to maintain "
                "minimum capital adequacy ratios as specified by State Bank of Pakistan."
    }]
    
    answer2 = """Banks must maintain a capital adequacy ratio of exactly 12% according 
    to the Banking Companies Ordinance. Failure to comply results in automatic license revocation."""
    
    # Test Example 1
    print("\n" + "="*70)
    print("TEST 1: Well-supported answer")
    print("="*70)
    results1 = detector.detect_hallucinations(answer1, context1)
    report1 = detector.get_hallucination_report(results1)
    detector.print_report(report1)
    
    # Test Example 2
    print("\n" + "="*70)
    print("TEST 2: Answer with hallucinations")
    print("="*70)
    results2 = detector.detect_hallucinations(answer2, context2)
    report2 = detector.get_hallucination_report(results2)
    detector.print_report(report2)


if __name__ == "__main__":
    test_hallucination_detector()