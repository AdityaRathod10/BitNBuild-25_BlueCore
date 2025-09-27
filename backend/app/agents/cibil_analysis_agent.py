"""
CIBIL Score Analysis Agent - Real AI Implementation
Analyzes credit behavior patterns and provides CIBIL score improvement strategies
"""

import os
import json
import logging
import numpy as np
import pandas as pd
from typing import Dict, Any, Optional, List
from datetime import datetime
from faker import Faker
import random

# Use our direct API import
try:
    from .swarms_compat import create_agent
    agent_creator, SWARMS_AVAILABLE = create_agent()
    print(f"🔍 DEBUG: CIBIL Agent - Direct API Available = {SWARMS_AVAILABLE}")
except ImportError as e:
    print(f"❌ DEBUG: CIBIL Agent Import error = {e}")
    raise Exception("Failed to initialize CIBIL API agent")

from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CibilAnalysisAgent:
    """
    CIBIL Score Analysis Agent - Real AI Implementation
    """
    
    def __init__(self):
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        
        if not self.groq_api_key:
            raise Exception("GROQ_API_KEY environment variable is required for CIBIL agent")
        
        if not agent_creator:
            raise Exception("Failed to initialize CIBIL agent creator")
        
        print(f"🔍 DEBUG: Initializing CIBIL AI agent...")
        
        # Initialize the real agent
        self.agent = agent_creator(
            agent_name="CIBIL-Score-Advisor",
            system_prompt=self._get_cibil_system_prompt(),
            groq_api_key=self.groq_api_key
        )
        
        # CIBIL score factors and weights
        self.score_factors = {
            "payment_history": {"weight": 35, "ideal_score": 95},
            "credit_utilization": {"weight": 30, "ideal_score": 10},  # Ideal <10%
            "credit_history_length": {"weight": 15, "ideal_score": 240},  # 20+ years in months
            "credit_mix": {"weight": 10, "ideal_score": 4},  # 4+ different types
            "new_credit": {"weight": 10, "ideal_score": 0}  # 0 new inquiries
        }
        
        # Score ranges
        self.score_ranges = {
            "poor": {"min": 300, "max": 549, "risk": "High"},
            "fair": {"min": 550, "max": 649, "risk": "Moderate"},
            "good": {"min": 650, "max": 749, "risk": "Low"},
            "excellent": {"min": 750, "max": 900, "risk": "Lowest"}
        }
        
        print(f"✅ DEBUG: CIBIL AI agent initialized")
        logger.info("✅ CIBIL Analysis Agent initialized (REAL AI ONLY)")
    
    def _get_cibil_system_prompt(self) -> str:
        """Get comprehensive system prompt for CIBIL analysis"""
        return """You are a CIBIL score improvement specialist with deep expertise in Indian credit systems.

CIBIL SCORE FACTORS & WEIGHTS:
1. **Payment History (35% impact)**:
   - On-time payment record for all credit accounts
   - Defaults, late payments, settlements, write-offs
   - Recent payment behavior weighs more heavily
   - Target: 100% on-time payments for 24+ months

2. **Credit Utilization (30% impact)**:
   - Total credit used vs. total credit available
   - Individual card utilization ratios
   - Ideal: <10% overall, <30% on any single card
   - Consider both statement balance and current balance

3. **Credit History Length (15% impact)**:
   - Age of oldest credit account
   - Average age of all accounts
   - Length of relationship with lenders
   - Target: 7+ years average account age

4. **Credit Mix (10% impact)**:
   - Variety of credit types: Credit cards, personal loans, home loans, auto loans
   - Balance between secured and unsecured credit
   - Revolving vs. installment credit diversity
   - Target: 3-4 different credit types

5. **New Credit (10% impact)**:
   - Recent credit inquiries (last 12-24 months)
   - New accounts opened recently
   - Rate shopping vs. credit seeking behavior
   - Target: <2 inquiries per year

INDIAN CREDIT BUREAU SPECIFICS:
- CIBIL TransUnion (most widely used)
- Experian, Equifax, CRIF High Mark
- Score range: 300-900 (higher is better)
- Free annual report from each bureau

CIBIL SCORE RANGES:
- 300-549: Poor (Loan rejection likely, high interest rates)
- 550-649: Fair (Conditional approval, higher rates)
- 650-749: Good (Better approval odds, competitive rates)
- 750-900: Excellent (Best rates, premium cards, instant approvals)

IMPROVEMENT STRATEGIES WITH TIMELINES:
**Immediate Actions (1-30 days):**
- Pay all outstanding dues immediately
- Reduce credit card balances below 30%
- Check credit report for errors and dispute
- Set up auto-pay for minimum amounts

**Short-term (1-3 months):**
- Maintain credit utilization <10%
- Pay bills 2-3 days before due date
- Request credit limit increases (don't use extra limit)
- Consolidate multiple small balances

**Medium-term (3-12 months):**
- Keep old credit cards active with small purchases
- Diversify credit mix gradually
- Build emergency fund to avoid credit dependency
- Monitor score monthly

**Long-term (1-3 years):**
- Maintain excellent payment history
- Gradually increase credit limits
- Consider becoming authorized user on family member's account
- Build long-term banking relationships

ANALYSIS FRAMEWORK:
Always provide:
1. Current estimated score with confidence level
2. Factor-wise breakdown with impact assessment
3. Prioritized improvement recommendations
4. Timeline for expected score changes
5. Specific action items with measurable targets
6. Risk assessment and preventive measures

RESPONSE FORMAT:
Structure responses with clear sections, specific numbers, and actionable timelines.
Focus on Indian banking practices, EMI culture, and CIBIL-specific factors.
"""

    def analyze_cibil_profile(self, credit_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze CIBIL profile using real AI
        """
        try:
            print(f"🔍 DEBUG: Starting CIBIL AI analysis...")
            
            # Create comprehensive analysis prompt
            prompt = self._create_cibil_analysis_prompt(credit_data)
            
            # Get AI response
            ai_response = self.agent.run(prompt)
            
            # Structure the AI response
            structured_result = self._structure_cibil_response(ai_response, credit_data)
            
            logger.info("✅ CIBIL AI analysis completed")
            return structured_result
                
        except Exception as e:
            logger.error(f"❌ CIBIL analysis failed: {str(e)}")
            raise Exception(f"CIBIL analysis failed: {str(e)}")
    
    def _create_cibil_analysis_prompt(self, credit_data: Dict[str, Any]) -> str:
        """Create comprehensive CIBIL analysis prompt"""
        
        # Extract credit data with defaults
        current_score = credit_data.get('current_score', 0)
        payment_history = credit_data.get('payment_history', 'unknown')
        credit_cards = credit_data.get('credit_cards', 0)
        total_credit_limit = credit_data.get('total_credit_limit', 0)
        current_utilization = credit_data.get('current_utilization', 0)
        loans = credit_data.get('loans', 0)
        missed_payments = credit_data.get('missed_payments', 0)
        account_age = credit_data.get('account_age_months', 0)
        recent_inquiries = credit_data.get('recent_inquiries', 0)
        
        return f"""
COMPREHENSIVE CIBIL SCORE ANALYSIS REQUEST:

Current Credit Profile:
- Current CIBIL Score: {current_score}
- Payment History: {payment_history}
- Number of Credit Cards: {credit_cards}
- Total Credit Limit: ₹{total_credit_limit:,}
- Current Utilization: {current_utilization}% (₹{total_credit_limit * current_utilization / 100:,.0f} used)
- Active Loans: {loans}
- Missed Payments (Last 24 months): {missed_payments}
- Oldest Account Age: {account_age} months ({account_age/12:.1f} years)
- Recent Credit Inquiries (Last 12 months): {recent_inquiries}

REQUIRED DETAILED ANALYSIS:

### 1. CURRENT SCORE ASSESSMENT:
- Estimated CIBIL Score: [Based on provided data and factors]
- Score Category: [Poor/Fair/Good/Excellent]
- Risk Profile: [High/Moderate/Low/Lowest]
- Score Confidence Level: [High/Medium/Low based on data completeness]

### 2. FACTOR-WISE BREAKDOWN:

**Payment History (35% weight):**
- Current Status: [Excellent/Good/Fair/Poor]
- Score Impact: [Positive/Neutral/Negative]
- Key Issues: [List specific problems if any]
- Improvement Potential: [High/Medium/Low]

**Credit Utilization (30% weight):**
- Current Utilization: {current_utilization}%
- Individual Card Analysis: [If high, suggest specific reductions]
- Score Impact: [Calculate positive/negative impact]
- Target Utilization: [Specific percentage and amount]

**Credit History Length (15% weight):**
- Average Account Age: {account_age/12:.1f} years
- Oldest Account Impact: [Positive/Negative]
- Recommendations: [Keep old accounts active/Don't close oldest card]

**Credit Mix (10% weight):**
- Current Mix: {credit_cards} cards, {loans} loans
- Mix Quality: [Excellent/Good/Fair/Poor]
- Missing Elements: [What types of credit to consider]

**New Credit (10% weight):**
- Recent Inquiries: {recent_inquiries} in last 12 months
- Impact Assessment: [Positive/Negative/Neutral]
- Inquiry Management: [Recommendations for future credit applications]

### 3. PRIORITIZED IMPROVEMENT PLAN:

**IMMEDIATE ACTIONS (Next 30 days):**
1. [Specific action with target amount/percentage]
2. [Specific action with deadline]
3. [Specific action with expected impact]

**SHORT-TERM GOALS (1-3 months):**
1. [Action with specific target and timeline]
2. [Behavioral change with measurable outcome]
3. [Account management specific steps]

**MEDIUM-TERM STRATEGY (3-12 months):**
1. [Strategic moves with expected score impact]
2. [Credit building activities]
3. [Relationship building with banks]

**LONG-TERM VISION (1-3 years):**
1. [Major credit goals]
2. [Premium credit access targets]
3. [Wealth building through credit optimization]

### 4. SCORE PROJECTION:
- Current Score: {current_score}
- 3-Month Projection: [Score range with actions]
- 6-Month Projection: [Score range with consistent behavior]
- 12-Month Projection: [Optimal score with full plan implementation]

### 5. SPECIFIC RECOMMENDATIONS:
**For Credit Cards:**
- Optimal utilization per card: [Specific amounts]
- Payment timing: [When to pay for maximum impact]
- Limit increase requests: [When and how much]

**For Loans:**
- EMI management: [Optimization strategies]
- Prepayment recommendations: [If beneficial]
- New loan considerations: [Timing and impact]

**For Credit Report:**
- Monitoring frequency: [How often to check]
- Error disputes: [Process and timeline]
- Documentation: [What records to maintain]

### 6. RED FLAGS TO AVOID:
- Actions that could hurt the score
- Common mistakes in Indian credit management
- Timeline-sensitive decisions

### 7. ESTIMATED FINANCIAL IMPACT:
- Interest savings from better score: ₹[Calculate based on typical loan amounts]
- Access to premium products: [List benefits]
- Credit limit improvements: [Expected increases]

Provide specific, actionable recommendations with exact numbers, dates, and expected outcomes.
Focus on Indian banking practices and CIBIL-specific optimization strategies.
"""

    def _structure_cibil_response(self, ai_response: str, credit_data: Dict[str, Any]) -> Dict[str, Any]:
        """Structure the AI response into API-compatible format"""
        
        return {
            "status": "success",
            "timestamp": datetime.now().isoformat(),
            "cibil_analysis": ai_response,
            "response_source": "Real AI CIBIL Analysis",
            "input_data": credit_data,
            "analysis_type": "comprehensive_cibil_profile"
        }
    
    def simulate_score_scenarios(self, scenarios: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Simulate CIBIL score impact of different scenarios"""
        try:
            print(f"🔍 DEBUG: Starting CIBIL scenario simulation...")
            
            # Create scenario simulation prompt
            prompt = self._create_scenario_simulation_prompt(scenarios)
            
            # Get AI response
            ai_response = self.agent.run(prompt)
            
            logger.info("✅ CIBIL scenario simulation completed")
            
            return {
                "status": "success",
                "timestamp": datetime.now().isoformat(),
                "scenario_analysis": ai_response,
                "response_source": "Real AI Scenario Simulation",
                "input_scenarios": scenarios
            }
                
        except Exception as e:
            logger.error(f"❌ CIBIL scenario simulation failed: {str(e)}")
            raise Exception(f"Scenario simulation failed: {str(e)}")
    
    def _create_scenario_simulation_prompt(self, scenarios: List[Dict[str, Any]]) -> str:
        """Create scenario simulation prompt"""
        
        scenario_text = ""
        for i, scenario in enumerate(scenarios, 1):
            scenario_text += f"""
Scenario {i}: {scenario.get('name', f'Scenario {i}')}
- Action: {scenario.get('action', 'Unknown')}
- Current Score: {scenario.get('current_score', 750)}
- Timeline: {scenario.get('timeline', 'Unknown')}
- Additional Details: {scenario.get('details', 'None')}
"""
        
        return f"""
CIBIL SCORE SCENARIO SIMULATION:

Please analyze the following scenarios and predict their impact on CIBIL score:

{scenario_text}

For each scenario, provide:

### SCENARIO IMPACT ANALYSIS:

**Score Change Prediction:**
- Expected Score Change: [+/- points]
- Confidence Level: [High/Medium/Low]
- Timeline for Impact: [Immediate/1-3 months/3-6 months/6-12 months]

**Factor Impact Breakdown:**
- Payment History Impact: [How this affects payment track record]
- Credit Utilization Impact: [How this changes utilization ratios]
- Credit History Impact: [Effect on account age/history]
- Credit Mix Impact: [How this changes credit diversity]
- New Credit Impact: [Effect on inquiries/new accounts]

**Risk Assessment:**
- Potential Negative Effects: [What could go wrong]
- Mitigation Strategies: [How to minimize negative impact]
- Best Practices: [How to maximize positive outcome]

**Comparison Analysis:**
- Rank scenarios from best to worst impact
- Provide reasoning for rankings
- Suggest combinations or sequences if applicable

**Implementation Guidelines:**
- Step-by-step execution plan
- Timing considerations
- Monitoring checkpoints

Focus on realistic, data-driven predictions based on Indian CIBIL scoring patterns.
"""

    def generate_cibil_report(self, user_profile: Dict[str, Any]) -> Dict[str, Any]:
        """Generate comprehensive CIBIL improvement report"""
        try:
            print(f"🔍 DEBUG: Generating CIBIL report...")
            
            # Create report generation prompt
            prompt = self._create_report_prompt(user_profile)
            
            # Get AI response
            ai_response = self.agent.run(prompt)
            
            logger.info("✅ CIBIL report generation completed")
            
            return {
                "status": "success",
                "timestamp": datetime.now().isoformat(),
                "cibil_report": ai_response,
                "response_source": "Real AI CIBIL Report",
                "user_profile": user_profile
            }
                
        except Exception as e:
            logger.error(f"❌ CIBIL report generation failed: {str(e)}")
            raise Exception(f"Report generation failed: {str(e)}")
    
    def _create_report_prompt(self, user_profile: Dict[str, Any]) -> str:
        """Create comprehensive report generation prompt"""
        
        return f"""
COMPREHENSIVE CIBIL IMPROVEMENT REPORT GENERATION:

User Profile:
- Age: {user_profile.get('age', 30)} years
- Income: ₹{user_profile.get('income', 500000):,} annually
- Current CIBIL Score: {user_profile.get('current_score', 650)}
- Credit Experience: {user_profile.get('credit_experience', 'Unknown')} years
- Financial Goals: {user_profile.get('goals', 'Credit improvement')}

Generate a comprehensive CIBIL improvement report with the following sections:

### EXECUTIVE SUMMARY
- Current credit health assessment (1-10 scale)
- Key strengths and weaknesses
- Primary improvement opportunities
- Expected timeline for significant improvement

### CURRENT SCORE ANALYSIS
- Detailed breakdown of current score factors
- Comparison with peer group (same age/income)
- Identification of biggest score drains
- Quick wins for immediate improvement

### 90-DAY IMPROVEMENT PLAN
- Week 1-2: Immediate actions
- Week 3-8: Consistency building
- Week 9-12: Optimization and monitoring
- Expected score change: [Range]

### 6-MONTH STRATEGY
- Monthly milestones and targets
- Behavioral changes required
- Account management strategies
- Credit building activities

### 12-MONTH ROADMAP
- Long-term score targets
- Premium credit access goals
- Financial benefits projection
- Risk management framework

### PERSONALIZED RECOMMENDATIONS
Based on age {user_profile.get('age', 30)} and income ₹{user_profile.get('income', 500000):,}:
- Optimal credit utilization strategy
- Recommended credit products
- Account management best practices
- Monitoring and maintenance plan

### FINANCIAL IMPACT ANALYSIS
- Interest savings potential
- Credit access improvements
- Premium product eligibility
- Overall financial benefits

### ACTION CHECKLIST
- Priority 1 (Immediate): [Specific actions]
- Priority 2 (This month): [Specific actions]
- Priority 3 (Next 3 months): [Specific actions]
- Ongoing maintenance: [Regular activities]

Provide specific, actionable recommendations with clear timelines and expected outcomes.
"""

def generate_sample_credit_data(num_users: int = 10) -> pd.DataFrame:
    """
    Generate sample credit data for testing CIBIL analysis
    """
    fake = Faker()
    np.random.seed(42)
    random.seed(42)
    
    data = []
    for i in range(1, num_users + 1):
        # Generate realistic credit profile
        score = np.random.normal(720, 80)  # Mean 720, std 80
        score = max(300, min(900, int(score)))  # Clamp to valid range
        
        credit_cards = random.randint(1, 6)
        total_limit = random.randint(100000, 2000000)
        utilization = random.uniform(5, 85)
        
        profile = {
            'user_id': i,
            'current_score': score,
            'credit_cards': credit_cards,
            'total_credit_limit': total_limit,
            'current_utilization': round(utilization, 1),
            'loans': random.randint(0, 3),
            'missed_payments': random.randint(0, 5),
            'account_age_months': random.randint(12, 240),
            'recent_inquiries': random.randint(0, 8),
            'payment_history': random.choice(['excellent', 'good', 'fair', 'poor']),
            'age': random.randint(22, 65),
            'income': random.randint(300000, 2000000)
        }
        
        data.append(profile)
    
    return pd.DataFrame(data)

# Test function
def test_cibil_agent():
    """Test the CIBIL Analysis Agent"""
    print("🧪 Testing CIBIL Analysis Agent...")
    
    try:
        agent = CibilAnalysisAgent()
        
        # Generate sample data
        sample_data = generate_sample_credit_data(5)
        print(f"\n📊 Generated sample credit data:")
        print(sample_data.head())
        
        # Test with first user
        test_credit_data = sample_data.iloc[0].to_dict()
        print(f"\n🔍 Testing with User ID: {test_credit_data['user_id']}")
        print(f"Current Score: {test_credit_data['current_score']}")
        print(f"Utilization: {test_credit_data['current_utilization']}%")
        
        # Analyze CIBIL profile
        result = agent.analyze_cibil_profile(test_credit_data)
        print(f"✅ CIBIL analysis completed - Response source: {result.get('response_source')}")
        
        # Test scenario simulation
        scenarios = [
            {
                "name": "Pay down credit card debt",
                "action": "Pay ₹50,000 towards credit cards",
                "current_score": test_credit_data['current_score'],
                "timeline": "1 month"
            },
            {
                "name": "Close oldest credit card",
                "action": "Close 5-year old credit card",
                "current_score": test_credit_data['current_score'],
                "timeline": "Immediate"
            }
        ]
        
        scenario_result = agent.simulate_score_scenarios(scenarios)
        print(f"✅ Scenario simulation completed")
        
    except Exception as e:
        print(f"❌ CIBIL agent test failed: {str(e)}")

if __name__ == "__main__":
    test_cibil_agent()