# main.py - FastAPI Integration with Tax Calculation Agent for TaxWise

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict, List, Any, Optional
import pandas as pd
import json
import io
import os
from datetime import datetime
import logging

# Import our Tax Calculation Agent
from agents.tax_calculation_agent import TaxCalculationAgent

from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="TaxWise AI - Tax Calculation Agent",
    description="AI-powered tax calculation and optimization for Indian users",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for API requests
class TaxCalculationRequest(BaseModel):
    annual_income: float
    investments_80c: Optional[float] = 0
    health_insurance: Optional[float] = 0
    home_loan_interest: Optional[float] = 0
    hra_claimed: Optional[float] = 0
    other_deductions: Optional[Dict[str, float]] = {}

class TaxOptimizationRequest(BaseModel):
    age: int
    annual_income: float
    existing_investments: Optional[Dict[str, float]] = {}
    risk_appetite: Optional[str] = "moderate"
    family_size: Optional[int] = 1
    city_tier: Optional[str] = "metro"

class QuickTaxQueryRequest(BaseModel):
    question: str
    income_details: Optional[Dict[str, Any]] = None

# Initialize the Tax Agent
try:
    tax_agent = TaxCalculationAgent()
    logger.info("✅ Tax Calculation Agent initialized successfully")
except Exception as e:
    logger.error(f"❌ Failed to initialize Tax Agent: {str(e)}")
    tax_agent = None

# API Endpoints

@app.get("/")
async def root():
    return {
        "message": "TaxWise AI - Tax Calculation Agent",
        "version": "1.0.0",
        "status": "active",
        "agent_status": "ready" if tax_agent else "error",
        "capabilities": [
            "Tax liability calculation (Old vs New regime)",
            "Investment recommendations for tax saving",
            "Personalized tax optimization strategies",
            "Timeline-based tax planning"
        ]
    }

@app.get("/api/health")
async def health_check():
    """API health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "tax_agent_ready": tax_agent is not None,
        "groq_api_configured": bool(os.getenv("GROQ_API_KEY")),
        "agent_mode": "real" if tax_agent and tax_agent.use_real_agent else "mock"
    }

@app.post("/api/calculate-tax")
async def calculate_tax(request: TaxCalculationRequest):
    """Calculate tax liability for both old and new regime"""
    
    if not tax_agent:
        raise HTTPException(status_code=500, detail="Tax agent not initialized")
    
    try:
        # Convert request to dict for processing
        financial_data = {
            "annual_income": request.annual_income,
            "investments_80c": request.investments_80c,
            "health_insurance": request.health_insurance,
            "home_loan_interest": request.home_loan_interest,
            "hra_claimed": request.hra_claimed,
            "other_deductions": request.other_deductions or {}
        }
        
        logger.info(f"💰 Calculating tax for income: ₹{request.annual_income:,}")
        
        # Calculate tax using the agent
        result = tax_agent.calculate_tax_liability(financial_data)
        
        return JSONResponse(content=result)
        
    except Exception as e:
        logger.error(f"❌ Error calculating tax: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Tax calculation failed: {str(e)}")

@app.post("/api/optimize-tax")
async def optimize_tax_strategy(request: TaxOptimizationRequest):
    """Get comprehensive tax optimization strategy"""
    
    if not tax_agent:
        raise HTTPException(status_code=500, detail="Tax agent not initialized")
    
    try:
        # Convert request to dict for processing
        user_profile = {
            "age": request.age,
            "annual_income": request.annual_income,
            "existing_investments": request.existing_investments or {},
            "risk_appetite": request.risk_appetite,
            "family_size": request.family_size,
            "city_tier": request.city_tier
        }
        
        logger.info(f"🎯 Optimizing tax strategy for user: Age {request.age}, Income ₹{request.annual_income:,}")
        
        # Get optimization strategy
        result = tax_agent.optimize_tax_strategy(user_profile)
        
        return JSONResponse(content=result)
        
    except Exception as e:
        logger.error(f"❌ Error in tax optimization: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Tax optimization failed: {str(e)}")

@app.post("/api/tax-query")
async def handle_tax_query(request: QuickTaxQueryRequest):
    """Handle quick tax-related questions"""
    
    if not tax_agent:
        raise HTTPException(status_code=500, detail="Tax agent not initialized")
    
    try:
        # For now, we'll use the tax calculation with dummy data
        # In a real scenario, you'd parse the question and extract relevant info
        
        sample_data = {
            "annual_income": request.income_details.get("annual_income", 1000000) if request.income_details else 1000000,
            "investments_80c": 50000,
            "health_insurance": 0,
            "home_loan_interest": 0
        }
        
        result = tax_agent.calculate_tax_liability(sample_data)
        
        return {
            "status": "success",
            "question": request.question,
            "response": result,
            "note": "This is a basic calculation. For detailed advice, use the calculate-tax or optimize-tax endpoints.",
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"❌ Error processing tax query: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Tax query failed: {str(e)}")

@app.post("/api/analyze-financial-data")
async def analyze_financial_data(file: UploadFile = File(...)):
    """Process uploaded financial documents for tax analysis"""
    
    if not tax_agent:
        raise HTTPException(status_code=500, detail="Tax agent not initialized")
    
    try:
        # Validate file type
        if not file.filename.lower().endswith(('.csv', '.xlsx', '.xls')):
            raise HTTPException(status_code=400, detail="Only CSV and Excel files are supported")
        
        # Read and process file
        content = await file.read()
        
        if file.filename.lower().endswith('.csv'):
            df = pd.read_csv(io.StringIO(content.decode('utf-8')))
        else:
            df = pd.read_excel(io.BytesIO(content))
        
        logger.info(f"📁 Processing file: {file.filename} with {len(df)} transactions")
        
        # Extract financial insights from the data
        financial_insights = extract_financial_insights(df)
        
        # Calculate tax based on extracted data
        tax_result = tax_agent.calculate_tax_liability(financial_insights)
        
        return JSONResponse(content={
            "status": "success",
            "file_info": {
                "filename": file.filename,
                "transactions": len(df),
                "date_range": get_date_range(df)
            },
            "financial_insights": financial_insights,
            "tax_analysis": tax_result,
            "timestamp": datetime.now().isoformat()
        })
        
    except pd.errors.EmptyDataError:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")
    except pd.errors.ParserError:
        raise HTTPException(status_code=400, detail="Unable to parse file. Please check format.")
    except Exception as e:
        logger.error(f"❌ Error analyzing financial data: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

def extract_financial_insights(df: pd.DataFrame) -> Dict[str, Any]:
    """Extract financial insights from bank statement data"""
    try:
        # Ensure we have the required columns
        if 'amount' not in df.columns or 'category' not in df.columns:
            raise ValueError("CSV must contain 'amount' and 'category' columns")
        
        # Calculate income (credits)
        income_transactions = df[df['amount'] > 0]
        annual_income = income_transactions['amount'].sum()
        
        # Calculate expenses by category
        expense_transactions = df[df['amount'] < 0]
        expenses_by_category = expense_transactions.groupby('category')['amount'].sum().abs()
        
        # Identify tax-relevant investments
        investment_categories = ['Investment', 'SIP', 'PPF', 'ELSS', 'Insurance']
        investments_80c = 0
        health_insurance = 0
        
        for category in investment_categories:
            category_expenses = expenses_by_category.get(category, 0)
            if 'insurance' in category.lower() and 'health' in str(df[df['category'] == category]['description'].str.lower()).lower():
                health_insurance += category_expenses
            else:
                investments_80c += category_expenses
        
        return {
            "annual_income": float(annual_income),
            "investments_80c": float(investments_80c),
            "health_insurance": float(health_insurance),
            "home_loan_interest": float(expenses_by_category.get('Home Loan EMI', 0)),
            "total_expenses": float(expense_transactions['amount'].sum()),
            "expense_breakdown": {k: float(v) for k, v in expenses_by_category.to_dict().items()}
        }
        
    except Exception as e:
        logger.error(f"Error extracting financial insights: {str(e)}")
        # Return default values
        return {
            "annual_income": 1000000,
            "investments_80c": 50000,
            "health_insurance": 0,
            "home_loan_interest": 0,
            "total_expenses": 500000,
            "expense_breakdown": {}
        }

def get_date_range(df: pd.DataFrame) -> Dict[str, str]:
    """Get date range from the dataframe"""
    try:
        if 'date' in df.columns:
            df['date'] = pd.to_datetime(df['date'])
            return {
                "start_date": df['date'].min().strftime("%Y-%m-%d"),
                "end_date": df['date'].max().strftime("%Y-%m-%d")
            }
    except:
        pass
    
    return {"start_date": "N/A", "end_date": "N/A"}

@app.get("/api/tax-constants")
async def get_tax_constants():
    """Get current tax constants and limits for AY 2024-25"""
    
    if not tax_agent:
        raise HTTPException(status_code=500, detail="Tax agent not initialized")
    
    return {
        "assessment_year": "2024-25",
        "constants": tax_agent.tax_constants,
        "last_updated": "2024-04-01"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="info"
    )