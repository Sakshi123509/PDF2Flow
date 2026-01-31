import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.environ.get("ANTHROPIC_API_KEY")

if api_key:
    print(f"✅ API Key loaded: {api_key[:20]}...")
    
    # Test import
    try:
        import anthropic
        print("✅ anthropic package installed")
        
        # Test client
        client = anthropic.Anthropic(api_key=api_key)
        print("✅ Client initialized successfully")
        print("\n🎉 AI is ready to use!")
        
    except ImportError:
        print("❌ anthropic package NOT installed")
        print("Run: pip install anthropic")
    except Exception as e:
        print(f"❌ Error: {e}")
else:
    print("❌ API Key NOT found in environment")