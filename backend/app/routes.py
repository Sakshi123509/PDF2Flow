from fastapi import APIRouter, UploadFile, File, HTTPException
from app.pdf_utils import pdf_to_text, analyze_with_ai, analyze_for_mindmap

router = APIRouter()

@router.post("/generate-flow")
async def generate_flow(file: UploadFile = File(...)):
    """
    AI-powered flowchart generation
    Returns structured flowchart with no filler words
    """
    
    # Validate file type
    if not file.filename.endswith('.pdf'):
        raise HTTPException(
            status_code=400, 
            detail="Only PDF files are allowed"
        )
    
    try:
        # Read PDF content
        content = await file.read()
        
        # Extract text
        text = pdf_to_text(content)
        
        if not text or len(text.strip()) < 50:
            raise HTTPException(
                status_code=400, 
                detail="PDF contains no readable text or text is too short"
            )
        
        print(f"📄 PDF uploaded: {file.filename}")
        print(f"📝 Extracted {len(text)} characters")
        
        # AI Analysis - This is where the magic happens!
        flowchart_steps = analyze_with_ai(text)
        
        print(f"✅ Generated {len(flowchart_steps)} flowchart steps")
        
        return flowchart_steps
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error processing PDF: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing PDF: {str(e)}"
        )


@router.post("/generate-mindmap")
async def generate_mindmap(file: UploadFile = File(...)):
    """
    AI-powered mind map generation
    Returns central topic with meaningful branches
    """
    
    if not file.filename.endswith('.pdf'):
        raise HTTPException(
            status_code=400, 
            detail="Only PDF files are allowed"
        )
    
    try:
        content = await file.read()
        text = pdf_to_text(content)
        
        if not text or len(text.strip()) < 50:
            raise HTTPException(
                status_code=400, 
                detail="PDF contains insufficient text"
            )
        
        print(f"📄 PDF uploaded for mind map: {file.filename}")
        
        # AI Analysis for mind map
        mindmap_data = analyze_for_mindmap(text)
        
        print(f"✅ Generated mind map with {len(mindmap_data)} nodes")
        
        return mindmap_data
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error: {str(e)}"
        )