"""
Hybrid retrieval combining BM25 and vector search
Best of both worlds: keyword matching + semantic similarity
"""

from rank_bm25 import BM25Okapi
import numpy as np
import faiss
import json
from sentence_transformers import SentenceTransformer
from typing import List, Dict

class HybridRetriever:
    def __init__(
        self, 
        vector_store_dir='vector_store_improved',
        embedding_model_name='sentence-transformers/all-MiniLM-L6-v2'
    ):
        """
        Initialize hybrid retriever
        
        Args:
            vector_store_dir: Directory containing FAISS index and metadata
            embedding_model_name: Name of embedding model
        """
        print("🔄 Initializing Hybrid Retriever...")
        
        # Load vector index
        print("   Loading FAISS index...")
        self.vector_index = faiss.read_index(f'{vector_store_dir}/legal_docs.index')
        
        # Load chunks metadata
        print("   Loading chunks metadata...")
        with open(f'{vector_store_dir}/chunks_metadata.json', 'r', encoding='utf-8') as f:
            self.chunks = json.load(f)
        
        print(f"   ✅ Loaded {len(self.chunks)} chunks")
        
        # Load embedding model
        print("   Loading embedding model...")
        self.embedding_model = SentenceTransformer(embedding_model_name)
        
        # Build BM25 index
        print("   Building BM25 index...")
        tokenized_docs = [self._tokenize(c['text']) for c in self.chunks]
        self.bm25 = BM25Okapi(tokenized_docs)
        
        print("✅ Hybrid Retriever ready!\n")
    
    @staticmethod
    def _tokenize(text: str) -> List[str]:
        """Simple tokenization"""
        return text.lower().split()
    
    def retrieve_vector(self, query: str, top_k: int = 10) -> np.ndarray:
        """
        Vector-based retrieval
        
        Returns:
            Array of scores for all documents
        """
        # Encode query
        query_embedding = self.embedding_model.encode([query]).astype('float32')
        faiss.normalize_L2(query_embedding)
        
        # Search
        scores, _ = self.vector_index.search(query_embedding, len(self.chunks))
        
        return scores[0]
    
    def retrieve_bm25(self, query: str) -> np.ndarray:
        """
        BM25-based retrieval
        
        Returns:
            Array of scores for all documents
        """
        tokenized_query = self._tokenize(query)
        scores = self.bm25.get_scores(tokenized_query)
        
        return scores
    
    def retrieve_hybrid(
        self, 
        query: str, 
        top_k: int = 5, 
        alpha: float = 0.6
    ) -> List[Dict]:
        """
        Hybrid retrieval combining BM25 and vector search
        
        Args:
            query: Search query
            top_k: Number of results to return
            alpha: Weight for vector search (1-alpha for BM25)
                   0.6 = 60% vector, 40% BM25
        
        Returns:
            List of retrieved chunks with scores
        """
        # Get scores from both methods
        vector_scores = self.retrieve_vector(query, top_k=len(self.chunks))
        bm25_scores = self.retrieve_bm25(query)
        
        # Normalize scores to [0, 1]
        vector_scores_norm = self._normalize_scores(vector_scores)
        bm25_scores_norm = self._normalize_scores(bm25_scores)
        
        # Combine scores
        hybrid_scores = alpha * vector_scores_norm + (1 - alpha) * bm25_scores_norm
        
        # Get top-k indices
        top_indices = np.argsort(hybrid_scores)[::-1][:top_k]
        
        # Build results
        results = []
        for idx in top_indices:
            chunk = self.chunks[idx]
            results.append({
                'score': float(hybrid_scores[idx]),
                'vector_score': float(vector_scores[idx]),
                'bm25_score': float(bm25_scores[idx]),
                'text': chunk['text'],
                'metadata': {
                    'act_title': chunk.get('act_title', 'Unknown'),
                    'section_number': chunk.get('section_number', 'N/A'),
                    'section_title': chunk.get('section_title', 'N/A'),
                    'source_type': chunk.get('source_type', 'Unknown'),
                }
            })
        
        return results
    
    @staticmethod
    def _normalize_scores(scores: np.ndarray) -> np.ndarray:
        """Normalize scores to [0, 1] range"""
        min_score = scores.min()
        max_score = scores.max()
        
        if max_score - min_score < 1e-10:
            return np.zeros_like(scores)
        
        return (scores - min_score) / (max_score - min_score)


def test_hybrid_retrieval():
    """Test hybrid retrieval"""
    
    retriever = HybridRetriever(vector_store_dir='vector_store_improved')
    
    test_queries = [
        "What is the penalty for insider trading?",
        "capital adequacy ratio for banks",
        "SECP regulatory requirements",
    ]
    
    print("="*70)
    print("🧪 TESTING HYBRID RETRIEVAL")
    print("="*70)
    
    for query in test_queries:
        print(f"\n🔍 Query: {query}")
        print("-"*70)
        
        results = retriever.retrieve_hybrid(query, top_k=3, alpha=0.6)
        
        for i, result in enumerate(results, 1):
            print(f"\n{i}. Score: {result['score']:.4f} "
                  f"(Vec: {result['vector_score']:.4f}, BM25: {result['bm25_score']:.4f})")
            print(f"   {result['metadata']['act_title']}")
            print(f"   Section {result['metadata']['section_number']}")
            print(f"   {result['text'][:150]}...")
    
    print("\n" + "="*70)


if __name__ == "__main__":
    test_hybrid_retrieval()