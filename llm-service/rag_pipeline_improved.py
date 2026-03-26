"""
Improved RAG Pipeline with Hybrid Retrieval
No model retraining required - only retrieval improvements
"""

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel
import os
from hybrid_retrieval import HybridRetriever
import numpy as np

class ImprovedLegalRAG:
    def __init__(
        self,
        vector_store_dir='vector_store_improved',
        model_path='models/legal-llm-finetuned',
        base_model_name='mistralai/Mistral-7B-Instruct-v0.2',
        use_gpu=True,
        use_hybrid_retrieval=True,
        hybrid_alpha=0.6  # 60% vector, 40% BM25
    ):
        print("🔄 Initializing Improved Legal RAG Pipeline...")
        
        self.device = "cuda" if use_gpu and torch.cuda.is_available() else "cpu"
        self.use_hybrid = use_hybrid_retrieval
        self.hybrid_alpha = hybrid_alpha
        
        print(f"   Using device: {self.device}")
        print(f"   Hybrid retrieval: {use_hybrid_retrieval}")
        
        # Load retriever (hybrid or standard)
        if use_hybrid_retrieval:
            print("   Loading Hybrid Retriever...")
            self.retriever = HybridRetriever(vector_store_dir=vector_store_dir)
        else:
            print("   Loading Standard Retriever...")
            from sentence_transformers import SentenceTransformer
            import faiss
            import json
            
            self.index = faiss.read_index(f'{vector_store_dir}/legal_docs.index')
            with open(f'{vector_store_dir}/chunks_metadata.json', 'r') as f:
                self.chunks = json.load(f)
            self.embedding_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
        
        # Load language model
        self._load_language_model(model_path, base_model_name)
        
        print("✅ Improved RAG Pipeline ready!\n")
    
    def _load_language_model(self, model_path, base_model_name):
        """Load fine-tuned language model"""
        print("   Loading fine-tuned model...")
        
        adapter_config = os.path.join(model_path, "adapter_config.json")
        
        if os.path.exists(adapter_config):
            # Load base model
            self.model = AutoModelForCausalLM.from_pretrained(
                base_model_name,
                torch_dtype=torch.float16 if self.device == "cuda" else torch.float32,
                device_map="auto" if self.device == "cuda" else None,
                low_cpu_mem_usage=True
            )
            
            # Load adapter
            self.model = PeftModel.from_pretrained(self.model, model_path)
            self.model = self.model.merge_and_unload()
        else:
            self.model = AutoModelForCausalLM.from_pretrained(
                model_path,
                torch_dtype=torch.float16 if self.device == "cuda" else torch.float32,
                device_map="auto" if self.device == "cuda" else None,
            )
        
        self.tokenizer = AutoTokenizer.from_pretrained(model_path)
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token
        
        self.model.eval()
        print("   ✅ Model loaded")
    
    def retrieve(self, query: str, top_k: int = 5):
        """
        Retrieve relevant chunks using hybrid or standard method
        """
        if self.use_hybrid:
            return self.retriever.retrieve_hybrid(
                query, 
                top_k=top_k, 
                alpha=self.hybrid_alpha
            )
        else:
            # Standard vector search fallback
            query_embedding = self.embedding_model.encode([query]).astype('float32')
            import faiss
            faiss.normalize_L2(query_embedding)
            
            distances, indices = self.index.search(query_embedding, top_k)
            
            results = []
            for dist, idx in zip(distances[0], indices[0]):
                chunk = self.chunks[idx]
                results.append({
                    'score': float(dist),
                    'text': chunk['text'],
                    'metadata': {
                        'act_title': chunk.get('act_title', 'Unknown'),
                        'section_number': chunk.get('section_number', 'N/A'),
                        'section_title': chunk.get('section_title', 'N/A'),
                    }
                })
            
            return results
    
    def generate(self, query: str, context_chunks: list, max_new_tokens: int = 384):
        """Generate answer using retrieved context"""
        # Build context
        context_parts = []
        for i, chunk in enumerate(context_chunks[:3]):
            text = chunk['text'][:500]
            if len(chunk['text']) > 500:
                text += "..."
            
            context_parts.append(
                f"[Source {i+1}] {chunk['metadata']['act_title']}, "
                f"Section {chunk['metadata']['section_number']}:\n{text}"
            )
        
        context = "\n\n".join(context_parts)
        
        # Create prompt
        prompt = f"""<s>[INST] You are a legal expert on Pakistani financial regulations.

Using the legal sources below, answer the question clearly and cite specific sections.

{context}

Question: {query}

Provide a clear answer based on the sources. [/INST]"""
        
        # Tokenize
        inputs = self.tokenizer(
            prompt,
            return_tensors="pt",
            truncation=True,
            max_length=2048
        ).to(self.model.device)
        
        # Generate
        with torch.no_grad():
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=max_new_tokens,
                temperature=0.6,
                top_p=0.85,
                repetition_penalty=1.3,
                do_sample=True,
                pad_token_id=self.tokenizer.eos_token_id,
            )
        
        # Decode
        response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        if "[/INST]" in response:
            response = response.split("[/INST]", 1)[1].strip()
        
        return response
    
    def answer_query(self, query: str, top_k: int = 5, verbose: bool = True):
        """Complete RAG pipeline"""
        if verbose:
            print(f"\n🔍 Query: {query}")
            print("📚 Retrieving relevant provisions...")
        
        chunks = self.retrieve(query, top_k=top_k)
        
        if not chunks:
            return {
                'query': query,
                'answer': "No relevant legal provisions found.",
                'citations': [],
                'confidence': 0.0
            }
        
        if verbose:
            print(f"✅ Retrieved {len(chunks)} sections")
            for i, chunk in enumerate(chunks, 1):
                score_info = f"(score: {chunk['score']:.2%}"
                if 'vector_score' in chunk:
                    score_info += f", vec: {chunk['vector_score']:.2%}, bm25: {chunk['bm25_score']:.2%}"
                score_info += ")"
                
                print(f"   {i}. {chunk['metadata']['act_title'][:50]}... "
                      f"§{chunk['metadata']['section_number']} {score_info}")
        
        if verbose:
            print("\n🤖 Generating answer...")
        
        answer = self.generate(query, chunks)
        
        citations = [
            f"[{i+1}] {c['metadata']['act_title']}, "
            f"Section {c['metadata']['section_number']}"
            for i, c in enumerate(chunks)
        ]
        
        return {
            'query': query,
            'answer': answer,
            'citations': citations,
            'confidence': float(np.mean([c['score'] for c in chunks])),
            'num_sources': len(chunks)
        }


def main():
    """Test improved RAG pipeline"""
    
    print("="*70)
    print("🚀 IMPROVED LEGAL RAG PIPELINE")
    print("="*70)
    
    rag = ImprovedLegalRAG(
        vector_store_dir='vector_store_improved',
        use_hybrid_retrieval=True,
        hybrid_alpha=0.6
    )
    
    test_queries = [
        "What is the penalty for insider trading in Pakistan?",
        "What are the capital requirements for banks?",
        "What is the role of SECP?",
    ]
    
    for query in test_queries:
        result = rag.answer_query(query)
        
        print(f"\n{'='*70}")
        print(f"💡 Answer:")
        print(f"{result['answer']}")
        
        print(f"\n📚 Sources:")
        for citation in result['citations']:
            print(f"  • {citation}")
        
        print(f"\n📊 Confidence: {result['confidence']:.1%}")
        print('='*70)


if __name__ == "__main__":
    main()