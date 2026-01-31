from PyPDF2 import PdfReader
from io import BytesIO
import anthropic
import os
import json

def pdf_to_text(file):
    """Extract text from PDF file"""
    try:
        reader = PdfReader(BytesIO(file))
        full_text = ""
        
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                full_text += page_text + "\n"
        
        return full_text.strip()
    except Exception as e:
        print(f"Error extracting PDF text: {e}")
        return ""


def analyze_with_ai(text):
    """
    Use Claude AI to extract meaningful flowchart structure
    - Removes filler words: the, a, an, is, are, was, were
    - Extracts key concepts only
    - Creates proper structure
    """
    
    # Check if API key exists
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("ERROR: ANTHROPIC_API_KEY not found in environment!")
        return fallback_simple_parse(text)
    
    try:
        client = anthropic.Anthropic(api_key=api_key)
        
        prompt = f"""Analyze this educational PDF content and extract a meaningful, structured flowchart.

CRITICAL RULES:
1. REMOVE all filler words: "the", "a", "an", "is", "are", "was", "were", "in", "on", "at"
2. Extract ONLY key concepts, actions, and decisions
3. Keep each step under 8 words
4. Create logical flow: START → PROCESS → DECISION → END
5. For decisions, provide clear Yes/No branches

Return ONLY a JSON array in this EXACT format (no markdown, no explanations):
[
  {{"text": "Start: [Main Topic]", "type": "start"}},
  {{"text": "[Key Action/Concept]", "type": "process"}},
  {{"text": "[Question requiring decision]?", "type": "decision"}},
  {{"text": "Yes: [Consequence]", "type": "branch"}},
  {{"text": "No: [Alternative]", "type": "branch"}},
  {{"text": "[Next Key Step]", "type": "process"}},
  {{"text": "End: [Conclusion]", "type": "end"}}
]

EXAMPLE of GOOD output:
[
  {{"text": "Start: Coffee Making Process", "type": "start"}},
  {{"text": "Gather beans and equipment", "type": "process"}},
  {{"text": "Grind beans to medium coarseness", "type": "process"}},
  {{"text": "Water temperature correct?", "type": "decision"}},
  {{"text": "Yes: Pour water over grounds", "type": "branch"}},
  {{"text": "No: Wait for proper temperature", "type": "branch"}},
  {{"text": "Brew for 4 minutes", "type": "process"}},
  {{"text": "End: Serve coffee", "type": "end"}}
]

BAD output (don't do this):
{{"text": "The coffee is brewing", ...}}  ❌ Contains "the", "is"
{{"text": "A grinder", ...}}  ❌ Just "a grinder" - meaningless

PDF Content to analyze:
{text[:3000]}

Return ONLY the JSON array. No markdown. No explanations."""

        message = client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=2048,
            temperature=0.3,  # Lower for more consistent output
            messages=[{
                "role": "user",
                "content": prompt
            }]
        )
        
        # Extract response
        response_text = message.content[0].text.strip()
        
        # Remove markdown code blocks if present
        if response_text.startswith('```'):
            lines = response_text.split('\n')
            response_text = '\n'.join(lines[1:-1])
            response_text = response_text.replace('```json', '').replace('```', '')
        
        # Parse JSON
        flowchart_data = json.loads(response_text)
        
        # Convert to simple text array for frontend
        # Frontend expects: ["text1", "text2", "text3"]
        result = [item["text"] for item in flowchart_data]
        
        print(f"✅ AI analyzed successfully. Generated {len(result)} steps.")
        return result
        
    except json.JSONDecodeError as e:
        print(f"❌ JSON parsing error: {e}")
        print(f"Response was: {response_text[:500]}")
        return fallback_simple_parse(text)
        
    except Exception as e:
        print(f"❌ AI analysis error: {e}")
        return fallback_simple_parse(text)


def fallback_simple_parse(text):
    """
    Fallback method if AI fails
    Simple but better than nothing
    """
    print("⚠️ Using fallback parsing method")
    
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    
    # Filter out very short lines
    lines = [line for line in lines if len(line) > 5]
    
    # Remove common filler patterns
    filtered = []
    for line in lines:
        # Skip if line is just articles or conjunctions
        if line.lower() in ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'and', 'or', 'but']:
            continue
        filtered.append(line)
    
    # Limit to reasonable number
    return filtered[:15]


def analyze_for_mindmap(text):
    """
    AI analysis specifically for mind map structure
    Returns central topic with meaningful branches
    """
    
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        return fallback_mindmap(text)
    
    try:
        client = anthropic.Anthropic(api_key=api_key)
        
        prompt = f"""Analyze this PDF and create a mind map structure for students.

RULES:
1. Identify ONE central topic (main idea)
2. Extract 5-8 key branches (main concepts)
3. Each branch must be 2-5 words (NO single words like "the")
4. REMOVE: "the", "a", "an", "is", "are"
5. Focus on KEY CONCEPTS only

Return ONLY JSON:
{{
  "central": "Main Topic",
  "branches": [
    "Key Concept 1",
    "Key Concept 2",
    "Key Concept 3",
    "Key Concept 4",
    "Key Concept 5"
  ]
}}

PDF Content:
{text[:3000]}

Return ONLY JSON, nothing else."""

        message = client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}]
        )
        
        response_text = message.content[0].text.strip()
        
        if response_text.startswith('```'):
            lines = response_text.split('\n')
            response_text = '\n'.join(lines[1:-1])
        
        mindmap_data = json.loads(response_text)
        
        # Convert to array format for frontend
        result = [mindmap_data["central"]] + mindmap_data["branches"]
        return result
        
    except Exception as e:
        print(f"Mind map AI error: {e}")
        return fallback_mindmap(text)


def fallback_mindmap(text):
    """Fallback for mind map if AI fails"""
    lines = [l.strip() for l in text.split("\n") if l.strip() and len(l) > 5]
    return lines[:8] if lines else ["Document Content"]