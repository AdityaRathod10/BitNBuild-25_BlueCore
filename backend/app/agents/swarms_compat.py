"""
Windows-compatible Swarms wrapper
"""

import os
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

# Try different import strategies
def create_agent():
    """Create a Swarms agent with Windows compatibility"""
    
    try:
        # Strategy 1: Try standard import
        from swarms.structs.agent import Agent
        from swarms.models import GroqModel
        
        def create_groq_agent(agent_name: str, system_prompt: str, groq_api_key: str):
            model = GroqModel(
                model_name="llama3-8b-8192",
                groq_api_key=groq_api_key,
                max_tokens=4000,
                temperature=0.1
            )
            
            agent = Agent(
                agent_name=agent_name,
                system_prompt=system_prompt,
                llm=model,
                max_loops=1,
                autosave=False,
                verbose=True
            )
            return agent
        
        logger.info("✅ Swarms imported successfully with GroqModel")
        return create_groq_agent, True
        
    except Exception as e1:
        logger.warning(f"GroqModel failed: {e1}")
        
        try:
            # Strategy 2: Try with OpenAI-compatible model
            from swarms.structs.agent import Agent
            
            def create_simple_agent(agent_name: str, system_prompt: str, groq_api_key: str):
                # Use environment variable approach
                os.environ["GROQ_API_KEY"] = groq_api_key
                
                agent = Agent(
                    agent_name=agent_name,
                    system_prompt=system_prompt,
                    model_name="groq/llama-3.3-70b-versatile",
                    max_loops=1,
                    autosave=False,
                    verbose=True
                )
                return agent
            
            logger.info("✅ Swarms imported with simple Agent")
            return create_simple_agent, True
            
        except Exception as e2:
            logger.warning(f"Simple Agent failed: {e2}")
            
            try:
                # Strategy 3: Direct API call fallback
                import requests
                
                def create_api_agent(agent_name: str, system_prompt: str, groq_api_key: str):
                    return GroqAPIAgent(agent_name, system_prompt, groq_api_key)
                
                logger.info("✅ Using direct Groq API fallback")
                return create_api_agent, True
                
            except Exception as e3:
                logger.error(f"All Swarms strategies failed: {e3}")
                return None, False

class GroqAPIAgent:
    """Direct Groq API implementation as fallback"""
    
    def __init__(self, agent_name: str, system_prompt: str, groq_api_key: str):
        self.agent_name = agent_name
        self.system_prompt = system_prompt
        self.groq_api_key = groq_api_key
        self.api_url = "https://api.groq.com/openai/v1/chat/completions"
    
    def run(self, prompt: str) -> str:
        """Run the agent with direct API call"""
        import requests
        
        headers = {
            "Authorization": f"Bearer {self.groq_api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "llama3-8b-8192",
            "messages": [
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 4000,
            "temperature": 0.1
        }
        
        try:
            response = requests.post(self.api_url, headers=headers, json=data)
            if response.status_code == 200:
                result = response.json()
                return result["choices"][0]["message"]["content"]
            else:
                logger.error(f"Groq API error: {response.status_code}")
                return f"API Error: {response.status_code}"
        except Exception as e:
            logger.error(f"Direct API call failed: {e}")
            return f"Error: {str(e)}"