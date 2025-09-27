// lib/api.ts
const API_BASE = 'http://localhost:8000';

export const api = {
    analyzeFile: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${API_BASE}/api/analyze-financial-data`, {
            method: 'POST',
            body: formData
        });
        
        return response.json();
    },
    
    askTaxQuestion: async (question: string) => {
        const response = await fetch(`${API_BASE}/api/tax-query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question })
        });
        
        return response.json();
    }
};