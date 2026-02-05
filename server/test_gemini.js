require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
  console.log("1. Reading API Key from .env...");
  const key = process.env.GEMINI_API_KEY;
  
  if (!key) {
    console.error("❌ ERROR: GEMINI_API_KEY is missing in .env file");
    return;
  }
  console.log(`   Key found: ${key.substring(0, 10)}...`);

  console.log("2. Initializing Gemini Client...");
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  console.log("3. Sending test prompt...");
  try {
    const result = await model.generateContent("Say 'Hello' if this works.");
    const response = await result.response;
    const text = response.text();
    console.log("✅ SUCCESS! API Responded:");
    console.log("   " + text);
  } catch (error) {
    console.error("\n❌ API REQUEST FAILED");
    console.error("   Error Message:", error.message);
    
    if (error.message.includes("API_KEY_INVALID")) {
      console.log("\n👉 DIAGNOSIS: The key is invalid. Please generate a new one at https://aistudio.google.com/app/apikey");
    } else if (error.message.includes("PERMISSION_DENIED")) {
      console.log("\n👉 DIAGNOSIS: The key exists but lacks permission. Ensure 'Generative Language API' is enabled in Google Cloud Console.");
    } else if (error.message.includes("404")) {
      console.log("\n👉 DIAGNOSIS: Model not found. 'gemini-1.5-pro' might not be available for this key/region.");
    }
  }
}

testGemini();
