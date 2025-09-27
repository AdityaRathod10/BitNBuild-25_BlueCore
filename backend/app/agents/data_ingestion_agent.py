"""
Data Ingestion Agent - Real AI Implementation
Converts any financial document (PDF, CSV, images, text) into standardized format for Tax and CIBIL agents
"""

import os
import json
import logging
import re
import pdfplumber
import pandas as pd
from typing import Dict, Any, Optional, List, Union
from datetime import datetime, timedelta
from io import BytesIO, StringIO
from PIL import Image
import base64

# Use our direct API import with fallback for both relative and direct imports
try:
    from .swarms_compat import create_agent
    agent_creator, SWARMS_AVAILABLE = create_agent()
    print(f"🔍 DEBUG: Data Ingestion Agent - Direct API Available = {SWARMS_AVAILABLE}")
except ImportError as e:
    print(f"🔍 DEBUG: Relative import failed, trying direct import: {e}")
    try:
        from swarms_compat import create_agent
        agent_creator, SWARMS_AVAILABLE = create_agent()
        print(f"🔍 DEBUG: Data Ingestion Agent - Direct API Available = {SWARMS_AVAILABLE}")
    except ImportError as e2:
        print(f"❌ DEBUG: Both imports failed: {e2}")
        print("❌ Creating fallback agent creator")
        
        # Create a fallback agent creator for testing
        def create_fallback_agent():
            print("⚠️  Using fallback agent creator for testing")
            return None, False
        
        agent_creator, SWARMS_AVAILABLE = create_fallback_agent()

from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DataIngestionAgent:
    """
    Data Ingestion Agent - Converts any financial document to standardized format
    """
    
    def __init__(self):
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        
        if not self.groq_api_key:
            print("⚠️  GROQ_API_KEY not found - using fallback mode")
            self.agent = None
        elif not agent_creator:
            print("⚠️  Agent creator not available - using fallback mode")
            self.agent = None
        else:
            print(f"🔍 DEBUG: Initializing Data Ingestion AI agent...")
            
            # Initialize the real agent
            self.agent = agent_creator(
                agent_name="Financial-Data-Processor",
                system_prompt=self._get_data_ingestion_system_prompt(),
                groq_api_key=self.groq_api_key
            )
        
        # Supported file types and their processing methods
        self.supported_formats = {
            'pdf': self._process_pdf,
            'csv': self._process_csv,
            'xlsx': self._process_excel,
            'xls': self._process_excel,
            'txt': self._process_text,
            'png': self._process_image,
            'jpg': self._process_image,
            'jpeg': self._process_image
        }
        
        # Store extracted data for reuse
        self.last_extracted_data = None
        
        print(f"✅ DEBUG: Data Ingestion AI agent initialized (Mode: {'AI' if self.agent else 'Fallback'})")
        logger.info("✅ Data Ingestion Agent initialized")
    
    def _get_data_ingestion_system_prompt(self) -> str:
        """Get comprehensive system prompt for data ingestion"""
        return """You are a financial document analysis specialist for Indian financial systems.

DOCUMENT TYPES YOU PROCESS:
1. **Bank Statements** (PDF/CSV/Images):
   - Transaction history, balances, account details
   - Extract income patterns, expense categories
   - Identify salary credits, EMI payments, investments

2. **Tax Documents** (Form 16, ITR, Investment certificates):
   - Income details, TDS information
   - 80C, 80D, 24B deductions
   - Previous tax payments, refunds

3. **Credit Reports** (CIBIL/Experian/Equifax):
   - Credit score, payment history
   - Credit card details, loan information
   - Account age, credit utilization

4. **Investment Statements** (Mutual Fund, PPF, ELSS):
   - Investment amounts, categories
   - Tax-saving instruments identification
   - Portfolio analysis

5. **Salary Slips & Employment Documents**:
   - Monthly/annual income calculation
   - PF contributions, professional tax
   - HRA, transport allowance details

EXTRACTION REQUIREMENTS:

**For Tax Agent Format:**
- annual_income: Total yearly income from all sources
- investments_80c: Section 80C eligible investments (PPF, ELSS, NSC, etc.)
- health_insurance: Section 80D eligible premiums
- home_loan_interest: Section 24B eligible interest payments
- hra_claimed: HRA exemption amounts
- other_deductions: Any additional deductions (80CCD, 80E, etc.)

**For CIBIL Agent Format:**
- current_score: CIBIL score if mentioned
- payment_history: excellent/good/fair/poor based on missed payments
- credit_cards: Number of credit cards
- total_credit_limit: Combined credit limit
- current_utilization: Credit utilization percentage
- loans: Number of active loans
- missed_payments: Count of missed/late payments
- account_age_months: Age of oldest credit account
- recent_inquiries: Credit inquiries in last 12 months

INDIAN FINANCIAL CONTEXT:
- Understand Indian tax sections (80C, 80D, 24B, HRA)
- Recognize Indian bank formats, transaction codes
- Identify common investment instruments (PPF, ELSS, NSC, LIC)
- Process Indian credit bureau formats (CIBIL, Experian)
- Handle multilingual content (English, Hindi numbers)

CRITICAL: At the end of your analysis, provide clear extracted values in this format:
EXTRACTED_VALUES:
ANNUAL_INCOME: [exact number only]
INVESTMENTS_80C: [exact number only]
HEALTH_INSURANCE: [exact number only]  
HOME_LOAN_INTEREST: [exact number only]
HRA_CLAIMED: [exact number only]
CURRENT_CIBIL_SCORE: [number if available, otherwise 0]
CREDIT_CARDS: [number of cards]
CREDIT_UTILIZATION: [percentage as number]

Be precise with number extraction and provide confidence scores for extracted values.
"""

    def process_file_path(self, file_path: str) -> Dict[str, Any]:
        """
        Process document from file path
        """
        try:
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"File not found: {file_path}")
            
            # Read file data
            with open(file_path, 'rb') as file:
                file_data = file.read()
            
            filename = os.path.basename(file_path)
            file_extension = filename.split('.')[-1].lower()
            
            print(f"🔍 DEBUG: Processing file from path: {file_path}")
            print(f"📄 File size: {len(file_data):,} bytes")
            
            result = self.process_document(file_data, filename, file_extension)
            
            # Store for reuse
            self.last_extracted_data = result
            
            return result
            
        except Exception as e:
            logger.error(f"❌ Error processing file path {file_path}: {str(e)}")
            raise Exception(f"File processing failed: {str(e)}")

    def process_document(self, file_data: bytes, filename: str, file_type: str) -> Dict[str, Any]:
        """
        Main processing function - handles any type of financial document
        """
        try:
            print(f"🔍 DEBUG: Processing document: {filename}")
            
            # Determine file type from filename if not provided
            if not file_type:
                file_extension = filename.split('.')[-1].lower()
                file_type = file_extension
            
            file_extension = file_type.lower()
            
            # Check if file type is supported
            if file_extension not in self.supported_formats:
                raise Exception(f"Unsupported file type: {file_extension}")
            
            # Process the document based on its type
            raw_extracted_data = self.supported_formats[file_extension](file_data, filename)
            
            # Use AI to analyze and structure the extracted data (or fallback)
            structured_data = self._ai_analyze_and_structure(raw_extracted_data, filename, file_extension)
            
            # Format for specific agents
            formatted_result = self._format_for_agents(structured_data)
            
            logger.info(f"✅ Document processing completed: {filename}")
            
            return {
                "status": "success",
                "timestamp": datetime.now().isoformat(),
                "document_info": {
                    "filename": filename,
                    "file_type": file_extension,
                    "processing_method": f"{'AI + ' if self.agent else 'Fallback + '}{file_extension.upper()} parser"
                },
                "raw_data": raw_extracted_data,
                "structured_analysis": structured_data,
                **formatted_result,
                "response_source": "Real AI Data Ingestion" if self.agent else "Fallback Data Ingestion"
            }
                
        except Exception as e:
            logger.error(f"❌ Document processing failed: {str(e)}")
            raise Exception(f"Document processing failed: {str(e)}")
    
    def _process_pdf(self, file_data: bytes, filename: str) -> Dict[str, Any]:
        """Process PDF documents (bank statements, tax documents, etc.)"""
        try:
            print(f"🔍 DEBUG: Processing PDF: {filename}")
            
            # Try text extraction first
            text_content = ""
            tables_data = []
            
            with pdfplumber.open(BytesIO(file_data)) as pdf:
                print(f"📄 PDF has {len(pdf.pages)} pages")
                
                for page_num, page in enumerate(pdf.pages):
                    # Extract text
                    page_text = page.extract_text()
                    if page_text:
                        text_content += f"\n--- Page {page_num + 1} ---\n{page_text}"
                    
                    # Extract tables
                    tables = page.extract_tables()
                    for table in tables:
                        if table:
                            tables_data.append({
                                "page": page_num + 1,
                                "table_data": table
                            })
            
            # If no text found, it might be a scanned PDF
            if len(text_content.strip()) < 100:
                text_content += "\n[Note: Limited text extracted - possibly scanned PDF - OCR might be needed]"
            
            print(f"📄 Extracted {len(text_content)} characters and {len(tables_data)} tables")
            
            return {
                "content_type": "pdf",
                "text_content": text_content,
                "tables_data": tables_data,
                "pages_processed": len(pdf.pages),
                "extraction_method": "pdfplumber"
            }
            
        except Exception as e:
            logger.error(f"Error processing PDF: {e}")
            return {
                "content_type": "pdf",
                "text_content": "",
                "tables_data": [],
                "error": str(e),
                "extraction_method": "failed"
            }
    
    def _process_csv(self, file_data: bytes, filename: str) -> Dict[str, Any]:
        """Process CSV files (bank statements, transaction data)"""
        try:
            print(f"🔍 DEBUG: Processing CSV: {filename}")
            
            # Try different encodings
            encodings = ['utf-8', 'latin-1', 'cp1252']
            df = None
            
            for encoding in encodings:
                try:
                    content = file_data.decode(encoding)
                    df = pd.read_csv(StringIO(content))
                    print(f"✅ Successfully decoded with {encoding}")
                    break
                except UnicodeDecodeError:
                    continue
                except Exception as e:
                    logger.warning(f"Failed to parse CSV with {encoding}: {e}")
                    continue
            
            if df is None:
                raise Exception("Could not decode CSV file with any encoding")
            
            # Extract basic information
            transactions = []
            for _, row in df.iterrows():
                transactions.append(row.to_dict())
            
            print(f"📊 CSV parsed: {len(df)} rows, {len(df.columns)} columns")
            print(f"📊 Columns: {list(df.columns)}")
            
            return {
                "content_type": "csv",
                "dataframe_info": {
                    "rows": len(df),
                    "columns": list(df.columns),
                    "shape": df.shape
                },
                "transactions": transactions,
                "sample_data": df.head(5).to_dict('records'),
                "extraction_method": "pandas"
            }
            
        except Exception as e:
            logger.error(f"Error processing CSV: {e}")
            return {
                "content_type": "csv",
                "error": str(e),
                "extraction_method": "failed"
            }
    
    def _process_excel(self, file_data: bytes, filename: str) -> Dict[str, Any]:
        """Process Excel files"""
        try:
            print(f"🔍 DEBUG: Processing Excel: {filename}")
            
            with BytesIO(file_data) as excel_buffer:
                # Read all sheets
                excel_file = pd.ExcelFile(excel_buffer)
                sheets_data = {}
                
                print(f"📊 Excel has {len(excel_file.sheet_names)} sheets: {excel_file.sheet_names}")
                
                for sheet_name in excel_file.sheet_names:
                    df = pd.read_excel(excel_buffer, sheet_name=sheet_name)
                    sheets_data[sheet_name] = {
                        "shape": df.shape,
                        "columns": list(df.columns),
                        "sample_data": df.head(5).to_dict('records'),
                        "transactions": df.to_dict('records')[:100]
                    }
                    print(f"📊 Sheet '{sheet_name}': {df.shape[0]} rows, {df.shape[1]} columns")
            
            return {
                "content_type": "excel",
                "sheets": list(sheets_data.keys()),
                "sheets_data": sheets_data,
                "extraction_method": "pandas"
            }
            
        except Exception as e:
            logger.error(f"Error processing Excel: {e}")
            return {
                "content_type": "excel",
                "error": str(e),
                "extraction_method": "failed"
            }
    
    def _process_text(self, file_data: bytes, filename: str) -> Dict[str, Any]:
        """Process plain text files"""
        try:
            print(f"🔍 DEBUG: Processing text file: {filename}")
            
            # Try different encodings
            encodings = ['utf-8', 'latin-1', 'cp1252']
            text_content = ""
            
            for encoding in encodings:
                try:
                    text_content = file_data.decode(encoding)
                    print(f"✅ Decoded with {encoding}")
                    break
                except UnicodeDecodeError:
                    continue
            
            print(f"📄 Extracted {len(text_content)} characters")
            
            return {
                "content_type": "text",
                "text_content": text_content,
                "character_count": len(text_content),
                "word_count": len(text_content.split()),
                "extraction_method": "direct_decode"
            }
            
        except Exception as e:
            logger.error(f"Error processing text: {e}")
            return {
                "content_type": "text",
                "error": str(e),
                "extraction_method": "failed"
            }
    
    def _process_image(self, file_data: bytes, filename: str) -> Dict[str, Any]:
        """Process image files (screenshots of statements, etc.) - OCR TESTING"""
        try:
            print(f"🔍 DEBUG: Processing image for OCR: {filename}")
            print(f"🖼️  Image size: {len(file_data):,} bytes")
            
            if self.agent:
                print("🤖 Using AI OCR to extract text from image...")
                
                # Use AI to extract text from image
                ai_prompt = """
                Extract ALL TEXT from this financial document image. This could be:
                
                **Bank Statements:**
                - Account numbers, dates, transaction amounts
                - Transaction descriptions, categories
                - Balance information, bank names
                
                **Credit Reports:**
                - CIBIL score, payment history
                - Credit card details, limits, utilization
                - Loan information, account ages
                
                **Tax Documents:**
                - Income details, TDS amounts
                - Investment details (80C, 80D)
                - Salary slips, Form 16 data
                
                **Investment Statements:**
                - Mutual fund holdings, NAVs
                - PPF, ELSS, NSC details
                - Portfolio values, returns
                
                INSTRUCTIONS:
                1. Extract ALL visible numbers and text exactly as shown
                2. Include account numbers, amounts, dates, names
                3. Don't interpret or calculate - just extract raw text
                4. Maintain structure where possible
                5. Note any tables, sections clearly
                
                Return the extracted text in a structured format preserving the original layout.
                """
                
                try:
                    # Get AI OCR result
                    ocr_result = self.agent.run(ai_prompt)
                    
                    print(f"✅ OCR completed - Extracted {len(ocr_result)} characters")
                    print(f"🔍 OCR Preview: {ocr_result[:200]}...")
                    
                    return {
                        "content_type": "image",
                        "ocr_text": ocr_result,
                        "image_size": len(file_data),
                        "extraction_method": "ai_ocr",
                        "ocr_length": len(ocr_result)
                    }
                    
                except Exception as ai_error:
                    logger.warning(f"AI OCR failed: {ai_error}")
                    return {
                        "content_type": "image",
                        "ocr_text": f"[OCR processing failed: {str(ai_error)}]",
                        "image_size": len(file_data),
                        "extraction_method": "ocr_failed",
                        "error": str(ai_error)
                    }
            else:
                print("⚠️  AI agent not available - OCR not processed")
                return {
                    "content_type": "image",
                    "ocr_text": "[AI agent not available - image uploaded but OCR not processed]",
                    "image_size": len(file_data),
                    "extraction_method": "no_ai"
                }
                
        except Exception as e:
            logger.error(f"Error processing image: {e}")
            return {
                "content_type": "image",
                "error": str(e),
                "extraction_method": "failed"
            }
    
    def _ai_analyze_and_structure(self, raw_data: Dict[str, Any], filename: str, file_type: str) -> Dict[str, Any]:
        """Use AI to analyze and structure the extracted data"""
        if not self.agent:
            print("⚠️  AI agent not available, using fallback analysis")
            return self._fallback_analyze_and_structure(raw_data, filename, file_type)
        
        try:
            print(f"🔍 DEBUG: AI analyzing extracted data...")
            
            # Create comprehensive analysis prompt
            prompt = self._create_analysis_prompt(raw_data, filename, file_type)
            
            # Get AI analysis
            ai_response = self.agent.run(prompt)
            
            print(f"✅ AI analysis completed - {len(ai_response)} characters")
            
            # Parse AI response to extract structured data
            structured_data = self._parse_ai_response(ai_response)
            
            return structured_data
            
        except Exception as e:
            logger.error(f"AI analysis failed: {e}")
            print("⚠️  AI analysis failed, using fallback")
            return self._fallback_analyze_and_structure(raw_data, filename, file_type)
    
    def _fallback_analyze_and_structure(self, raw_data: Dict[str, Any], filename: str, file_type: str) -> Dict[str, Any]:
        """Fallback analysis when AI is not available"""
        print("🔍 DEBUG: Using fallback analysis...")
        
        # Basic pattern-based extraction for CSV files
        extracted_values = {
            "annual_income": 0, 
            "investments_80c": 0, 
            "health_insurance": 0, 
            "home_loan_interest": 0,
            "hra_claimed": 0,
            "current_score": 0,
            "credit_cards": 0
        }
        
        if raw_data.get("content_type") == "csv" and raw_data.get("transactions"):
            transactions = raw_data.get("transactions", [])
            
            income_total = 0
            investment_total = 0
            insurance_total = 0
            loan_total = 0
            
            for transaction in transactions:
                amount = transaction.get("amount", 0)
                category = str(transaction.get("category", "")).lower()
                description = str(transaction.get("description", "")).lower()
                
                try:
                    amount = float(amount)
                except (ValueError, TypeError):
                    amount = 0
                
                # Income detection
                if amount > 0 and ("salary" in description or "income" in category):
                    income_total += amount
                
                # Investment detection
                elif amount < 0 and any(word in description or word in category for word in ["ppf", "elss", "investment", "sip"]):
                    investment_total += abs(amount)
                
                # Insurance detection
                elif amount < 0 and any(word in description or word in category for word in ["insurance", "premium"]):
                    insurance_total += abs(amount)
                
                # Loan detection
                elif amount < 0 and any(word in description or word in category for word in ["emi", "loan", "interest"]):
                    loan_total += abs(amount)
            
            # Calculate annualized figures (assuming monthly data)
            extracted_values = {
                "annual_income": income_total * 12 if income_total > 0 else 0,
                "investments_80c": investment_total * 12 if investment_total > 0 else 0,
                "health_insurance": insurance_total * 12 if insurance_total > 0 else 0,
                "home_loan_interest": loan_total * 12 if loan_total > 0 else 0,
                "hra_claimed": 0,
                "current_score": 0,
                "credit_cards": 0
            }
        
        return {
            "analysis_status": "fallback_success",
            "ai_analysis": f"Fallback analysis completed for {file_type} document. Extracted basic financial patterns.",
            "document_type": "bank_statement" if file_type == "csv" else "unknown",
            "confidence_level": 60,
            "extracted_values": extracted_values
        }
    
    def _create_analysis_prompt(self, raw_data: Dict[str, Any], filename: str, file_type: str) -> str:
        """Create comprehensive analysis prompt for AI"""
        
        # Extract content based on file type
        content_summary = ""
        if raw_data.get("text_content"):
            content_summary = raw_data["text_content"][:4000] + "..." if len(raw_data["text_content"]) > 4000 else raw_data["text_content"]
        elif raw_data.get("ocr_text"):
            content_summary = raw_data["ocr_text"][:4000] + "..." if len(raw_data["ocr_text"]) > 4000 else raw_data["ocr_text"]
        elif raw_data.get("transactions"):
            content_summary = f"CSV/Excel with {len(raw_data['transactions'])} transactions"
            # Add sample transactions
            sample_transactions = raw_data.get("sample_data", [])[:5]
            content_summary += f"\nSample transactions: {sample_transactions}"
        
        return f"""
FINANCIAL DOCUMENT ANALYSIS REQUEST:

Document Info:
- Filename: {filename}
- Type: {file_type.upper()}
- Content: {content_summary}

ANALYSIS REQUIRED:

### 1. DOCUMENT CLASSIFICATION:
Identify the document type:
- Bank Statement
- Tax Document (Form 16, ITR)
- Credit Report (CIBIL/Experian)
- Investment Statement
- Salary Slip
- Other Financial Document

### 2. DATA EXTRACTION FOR TAX AGENT:
Extract and calculate:
- **Annual Income**: Total yearly income from all sources
- **80C Investments**: PPF, ELSS, NSC, LIC premiums, tax-saving FDs
- **Health Insurance (80D)**: Health insurance premiums paid
- **Home Loan Interest (24B)**: Interest paid on home loans
- **HRA Claimed**: House rent allowance claimed
- **Other Deductions**: 80CCD (NPS), 80E (education loan), etc.

### 3. DATA EXTRACTION FOR CIBIL AGENT:
Extract and identify:
- **Current CIBIL Score**: If mentioned in document
- **Payment History**: Count missed/late payments → excellent/good/fair/poor
- **Credit Cards**: Number of credit cards identified
- **Total Credit Limit**: Combined limit of all cards
- **Current Utilization**: Credit used vs. available (percentage)
- **Active Loans**: Number of loans (home, personal, auto)
- **Missed Payments**: Count of defaults/late payments
- **Account Age**: Age of oldest credit account in months
- **Recent Inquiries**: Credit inquiries in last 12 months

IMPORTANT INSTRUCTIONS:
- Extract EXACT amounts from the document
- Convert monthly figures to annual where needed
- Identify Indian financial instruments correctly
- If information is missing, mark as 0 or "unknown"

CRITICAL: At the end of your response, provide clear extracted values in this format:
EXTRACTED_VALUES:
ANNUAL_INCOME: [number only]
INVESTMENTS_80C: [number only]
HEALTH_INSURANCE: [number only]  
HOME_LOAN_INTEREST: [number only]
HRA_CLAIMED: [number only]
CURRENT_CIBIL_SCORE: [number only, 0 if not available]
CREDIT_CARDS: [number only]
CREDIT_UTILIZATION: [number only, percentage]

RESPONSE FORMAT:
Provide detailed analysis with specific amounts and clear reasoning for each calculation.
"""

    def _parse_ai_response(self, ai_response: str) -> Dict[str, Any]:
        """Parse AI response and extract structured data"""
        try:
            # Extract values from the EXTRACTED_VALUES section
            extracted_values = self._extract_financial_values_improved(ai_response)
            
            return {
                "analysis_status": "success",
                "ai_analysis": ai_response,
                "document_type": self._extract_document_type(ai_response),
                "confidence_level": self._extract_confidence_level(ai_response),
                "extracted_values": extracted_values
            }
            
        except Exception as e:
            logger.error(f"Error parsing AI response: {e}")
            return {
                "analysis_status": "partial",
                "ai_analysis": ai_response,
                "parsing_error": str(e),
                "document_type": "unknown",
                "confidence_level": 50,
                "extracted_values": {}
            }
    
    def _extract_document_type(self, ai_response: str) -> str:
        """Extract document type from AI response"""
        ai_lower = ai_response.lower()
        
        if "bank statement" in ai_lower:
            return "bank_statement"
        elif "tax document" in ai_lower or "form 16" in ai_lower:
            return "tax_document"
        elif "credit report" in ai_lower or "cibil" in ai_lower:
            return "credit_report"
        elif "salary slip" in ai_lower:
            return "salary_slip"
        elif "investment" in ai_lower:
            return "investment_statement"
        else:
            return "unknown"
    
    def _extract_confidence_level(self, ai_response: str) -> int:
        """Extract confidence level from AI response"""
        # Look for confidence percentages in the response
        confidence_pattern = r'confidence[:\s]*(\d+)%'
        matches = re.findall(confidence_pattern, ai_response.lower())
        
        if matches:
            return int(matches[0])
        else:
            return 75  # Default confidence
    
    def _extract_financial_values_improved(self, ai_response: str) -> Dict[str, Any]:
        """Improved extraction of financial values from AI response"""
        values = {
            "annual_income": 0,
            "investments_80c": 0,
            "health_insurance": 0,
            "home_loan_interest": 0,
            "hra_claimed": 0,
            "current_score": 0,
            "credit_cards": 0,
            "credit_utilization": 0
        }
        
        # First try to extract from EXTRACTED_VALUES section
        extracted_section = re.search(r'EXTRACTED_VALUES?:?\s*(.*?)(?:\n\n|\Z)', ai_response, re.DOTALL | re.IGNORECASE)
        
        if extracted_section:
            section_text = extracted_section.group(1)
            print(f"🔍 DEBUG: Found EXTRACTED_VALUES section: {section_text[:300]}...")
            
            # Extract specific values
            patterns = {
                "annual_income": r'ANNUAL_INCOME[:\s]*([0-9,]+)',
                "investments_80c": r'INVESTMENTS?_80C[:\s]*([0-9,]+)',
                "health_insurance": r'HEALTH_INSURANCE[:\s]*([0-9,]+)',
                "home_loan_interest": r'HOME_LOAN_INTEREST[:\s]*([0-9,]+)',
                "hra_claimed": r'HRA_CLAIMED[:\s]*([0-9,]+)',
                "current_score": r'CURRENT_CIBIL_SCORE[:\s]*([0-9,]+)',
                "credit_cards": r'CREDIT_CARDS[:\s]*([0-9,]+)',
                "credit_utilization": r'CREDIT_UTILIZATION[:\s]*([0-9.,]+)'
            }
            
            for key, pattern in patterns.items():
                matches = re.findall(pattern, section_text, re.IGNORECASE)
                if matches:
                    try:
                        # Clean and convert to float
                        amount_str = matches[0].replace(',', '')
                        values[key] = float(amount_str)
                        print(f"🔍 DEBUG: Extracted {key}: {values[key]}")
                    except ValueError as e:
                        print(f"⚠️  Failed to convert {key} value '{matches[0]}': {e}")
                        values[key] = 0
        
        # Fallback to original extraction method if EXTRACTED_VALUES section not found
        if all(v == 0 for v in values.values()):
            print("🔍 DEBUG: Using fallback extraction method...")
            fallback_values = self._extract_financial_values_fallback(ai_response)
            values.update(fallback_values)
        
        return values
    
    def _extract_financial_values_fallback(self, ai_response: str) -> Dict[str, Any]:
        """Fallback extraction method"""
        values = {}
        
        # Look for common financial patterns in the response
        amount_patterns = {
            "annual_income": [
                r'annual income[:\s]*₹?[\s]*([0-9,]+)',
                r'yearly income[:\s]*₹?[\s]*([0-9,]+)',
                r'total income[:\s]*₹?[\s]*([0-9,]+)'
            ],
            "investments_80c": [
                r'80c[^0-9]*₹?[\s]*([0-9,]+)',
                r'section 80c[^0-9]*₹?[\s]*([0-9,]+)',
                r'ppf[^0-9]*₹?[\s]*([0-9,]+)'
            ],
            "health_insurance": [
                r'health insurance[^0-9]*₹?[\s]*([0-9,]+)',
                r'80d[^0-9]*₹?[\s]*([0-9,]+)',
                r'medical insurance[^0-9]*₹?[\s]*([0-9,]+)'
            ],
            "current_score": [
                r'cibil score[^0-9]*([0-9]+)',
                r'credit score[^0-9]*([0-9]+)',
                r'score[^0-9]*([0-9]{3})'
            ]
        }
        
        for key, patterns in amount_patterns.items():
            values[key] = 0
            for pattern in patterns:
                matches = re.findall(pattern, ai_response.lower())
                if matches:
                    try:
                        # Clean and convert to float
                        amount_str = matches[0].replace(',', '')
                        values[key] = float(amount_str)
                        break  # Use first match
                    except ValueError:
                        continue
        
        return values
    
    def _format_for_agents(self, structured_data: Dict[str, Any]) -> Dict[str, Any]:
        """Format the structured data for Tax and CIBIL agents"""
        
        # Extract values from analysis
        extracted_values = structured_data.get("extracted_values", {})
        ai_analysis = structured_data.get("ai_analysis", "")
        
        # Tax Agent Format
        tax_format = {
            "annual_income": extracted_values.get("annual_income", 0),
            "investments_80c": extracted_values.get("investments_80c", 0),
            "health_insurance": extracted_values.get("health_insurance", 0),
            "home_loan_interest": extracted_values.get("home_loan_interest", 0),
            "hra_claimed": extracted_values.get("hra_claimed", 0),
            "other_deductions": extracted_values.get("other_deductions", {})
        }
        
        # CIBIL Agent Format
        cibil_format = {
            "current_score": int(extracted_values.get("current_score", 0)),
            "payment_history": extracted_values.get("payment_history", "unknown"),
            "credit_cards": int(extracted_values.get("credit_cards", 0)),
            "total_credit_limit": extracted_values.get("total_credit_limit", 0),
            "current_utilization": extracted_values.get("credit_utilization", 0),
            "loans": extracted_values.get("loans", 0),
            "missed_payments": extracted_values.get("missed_payments", 0),
            "account_age_months": extracted_values.get("account_age_months", 0),
            "recent_inquiries": extracted_values.get("recent_inquiries", 0),
            "age": extracted_values.get("age", 30),
            "income": extracted_values.get("annual_income", 0)
        }
        
        # Financial Summary
        financial_summary = {
            "document_type": structured_data.get("document_type", "unknown"),
            "confidence_level": structured_data.get("confidence_level", 75),
            "processing_notes": "Data extracted and formatted for financial analysis",
            "ready_for_tax_analysis": tax_format["annual_income"] > 0,
            "ready_for_cibil_analysis": cibil_format["credit_cards"] > 0 or cibil_format["current_score"] > 0
        }
        
        return {
            "tax_agent_format": tax_format,
            "cibil_agent_format": cibil_format,
            "financial_summary": financial_summary,
            "ai_insights": ai_analysis[:500] + "..." if len(ai_analysis) > 500 else ai_analysis
        }

    def get_tax_data(self) -> Dict[str, Any]:
        """Get tax-formatted data from last extraction"""
        if self.last_extracted_data:
            return self.last_extracted_data.get("tax_agent_format", {})
        return {}
    
    def get_cibil_data(self) -> Dict[str, Any]:
        """Get CIBIL-formatted data from last extraction"""
        if self.last_extracted_data:
            return self.last_extracted_data.get("cibil_agent_format", {})
        return {}

# Interactive Test Function
def interactive_file_processor():
    """Interactive file processing with user input"""
    print("🚀 TaxWise Data Ingestion Agent - Interactive Tester")
    print("=" * 60)
    print("📁 Supported formats: CSV, PDF, Excel, Images (PNG/JPG), Text")
    print("🎯 Special focus: OCR for financial documents in images")
    print("=" * 60)
    
    try:
        agent = DataIngestionAgent()
        print("✅ Agent initialized successfully")
    except Exception as e:
        print(f"❌ Agent initialization failed: {e}")
        return
    
    while True:
        print(f"\n🎯 Data Ingestion Options:")
        print("1. 📄 Process file from path")
        print("2. 📊 Test with sample CSV")
        print("3. 🖼️  Test OCR with image (recommended for testing)")
        print("4. 🔍 View last extracted data")
        print("5. 💰 Get tax data format")
        print("6. 💳 Get CIBIL data format")
        print("7. ❌ Exit")
        
        choice = input("\nEnter your choice (1-7): ").strip()
        
        if choice == '1':
            print(f"\n📁 Enter full file path:")
            print("Examples:")
            print("  C:\\Users\\Asus\\Desktop\\bank_statement.csv")
            print("  C:\\Users\\Asus\\Documents\\cibil_report.pdf")
            print("  C:\\Users\\Asus\\Pictures\\statement_screenshot.png")
            
            file_path = input("\nFile path: ").strip().strip('"')
            
            if not file_path:
                print("❌ No file path provided")
                continue
            
            if not os.path.exists(file_path):
                print(f"❌ File not found: {file_path}")
                continue
            
            try:
                print(f"\n🔍 Processing: {os.path.basename(file_path)}")
                print("-" * 50)
                
                result = agent.process_file_path(file_path)
                display_results(result)
                
            except Exception as e:
                print(f"❌ Processing failed: {str(e)}")
        
        elif choice == '2':
            print(f"\n🧪 Testing with sample CSV data...")
            sample_csv = """date,amount,category,description
2024-01-01,85000,Income,SALARY CREDIT TCS
2024-01-05,-15000,Investment,PPF DEPOSIT
2024-01-10,-8000,Investment,ELSS SIP AXIS
2024-01-15,-35000,EMI,HOME LOAN EMI HDFC
2024-01-20,-6000,Insurance,HEALTH INSURANCE STAR
2024-02-01,85000,Income,SALARY CREDIT TCS
2024-02-05,-15000,Investment,PPF DEPOSIT
2024-02-10,-8000,Investment,ELSS SIP AXIS
2024-02-15,-35000,EMI,HOME LOAN EMI HDFC"""
            
            try:
                csv_bytes = sample_csv.encode('utf-8')
                result = agent.process_document(csv_bytes, "sample_financial.csv", "csv")
                display_results(result)
            except Exception as e:
                print(f"❌ Sample processing failed: {str(e)}")
        
        elif choice == '3':
            print(f"\n🖼️  OCR Testing Mode")
            print("Upload an image of:")
            print("  - Bank statement screenshot")
            print("  - CIBIL report image")
            print("  - Tax document photo")
            print("  - Salary slip image")
            
            file_path = input("\nImage file path: ").strip().strip('"')
            
            if not file_path:
                print("❌ No file path provided")
                continue
            
            if not os.path.exists(file_path):
                print(f"❌ File not found: {file_path}")
                continue
            
            file_ext = file_path.split('.')[-1].lower()
            if file_ext not in ['png', 'jpg', 'jpeg']:
                print(f"❌ Not an image file. Extension: {file_ext}")
                continue
            
            try:
                print(f"\n🔍 Processing OCR for: {os.path.basename(file_path)}")
                print("🤖 Using AI to extract text from image...")
                print("-" * 50)
                
                result = agent.process_file_path(file_path)
                display_results(result, show_ocr=True)
                
            except Exception as e:
                print(f"❌ OCR processing failed: {str(e)}")
        
        elif choice == '4':
            if agent.last_extracted_data:
                print(f"\n📋 Last Extracted Data Summary:")
                print("-" * 50)
                display_results(agent.last_extracted_data)
            else:
                print("⚠️  No data extracted yet. Process a file first.")
        
        elif choice == '5':
            tax_data = agent.get_tax_data()
            if tax_data:
                print(f"\n💰 Tax Agent Format:")
                print("-" * 30)
                for key, value in tax_data.items():
                    if isinstance(value, (int, float)) and value > 0:
                        print(f"  {key}: ₹{value:,.0f}")
                    else:
                        print(f"  {key}: {value}")
            else:
                print("⚠️  No tax data available. Process a file first.")
        
        elif choice == '6':
            cibil_data = agent.get_cibil_data()
            if cibil_data:
                print(f"\n💳 CIBIL Agent Format:")
                print("-" * 30)
                for key, value in cibil_data.items():
                    print(f"  {key}: {value}")
            else:
                print("⚠️  No CIBIL data available. Process a file first.")
        
        elif choice == '7':
            print(f"\n👋 Thank you for testing TaxWise Data Ingestion!")
            break
        
        else:
            print("❌ Invalid choice. Please enter 1-7.")

def display_results(result: Dict[str, Any], show_ocr: bool = False):
    """Display processing results in a nice format"""
    
    print(f"\n✅ Processing Status: {result.get('status')}")
    print(f"📄 File: {result.get('document_info', {}).get('filename')}")
    print(f"📊 Method: {result.get('document_info', {}).get('processing_method')}")
    print(f"🤖 Source: {result.get('response_source')}")
    
    # Show OCR results if it's an image
    if show_ocr and result.get('raw_data', {}).get('content_type') == 'image':
        ocr_text = result.get('raw_data', {}).get('ocr_text', '')
        if ocr_text and '[OCR' not in ocr_text:
            print(f"\n🔍 OCR Extracted Text:")
            print("-" * 30)
            print(ocr_text[:500] + "..." if len(ocr_text) > 500 else ocr_text)
    
    # Show financial summary
    summary = result.get('financial_summary', {})
    print(f"\n📋 Document Analysis:")
    print(f"   Document Type: {summary.get('document_type', 'unknown')}")
    print(f"   Confidence Level: {summary.get('confidence_level', 0)}%")
    print(f"   Ready for Tax Analysis: {'✅' if summary.get('ready_for_tax_analysis') else '❌'}")
    print(f"   Ready for CIBIL Analysis: {'✅' if summary.get('ready_for_cibil_analysis') else '❌'}")
    
    # Show extracted tax data
    tax_data = result.get('tax_agent_format', {})
    print(f"\n💰 Tax Data Extracted:")
    print(f"   Annual Income: ₹{tax_data.get('annual_income', 0):,.0f}")
    print(f"   80C Investments: ₹{tax_data.get('investments_80c', 0):,.0f}")
    print(f"   Health Insurance: ₹{tax_data.get('health_insurance', 0):,.0f}")
    print(f"   Home Loan Interest: ₹{tax_data.get('home_loan_interest', 0):,.0f}")
    print(f"   HRA Claimed: ₹{tax_data.get('hra_claimed', 0):,.0f}")
    
    # Show CIBIL data if available
    cibil_data = result.get('cibil_agent_format', {})
    if cibil_data.get('current_score', 0) > 0 or cibil_data.get('credit_cards', 0) > 0:
        print(f"\n💳 CIBIL Data Extracted:")
        print(f"   Current Score: {cibil_data.get('current_score', 'N/A')}")
        print(f"   Credit Cards: {cibil_data.get('credit_cards', 0)}")
        print(f"   Credit Utilization: {cibil_data.get('current_utilization', 0)}%")
    
    # Show AI insights (truncated)
    insights = result.get('ai_insights', '')
    if insights and len(insights) > 10:
        print(f"\n🤖 AI Insights Preview:")
        print(f"   {insights[:200]}...")
    
    # Next steps
    total_income = tax_data.get('annual_income', 0)
    if total_income > 0:
        print(f"\n🎯 Ready for Analysis:")
        print(f"   ✅ Tax calculation and optimization")
        print(f"   ✅ Investment recommendations")
        print(f"   ✅ Financial planning")

if __name__ == "__main__":
    interactive_file_processor()