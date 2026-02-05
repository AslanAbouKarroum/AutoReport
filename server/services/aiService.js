const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const generateVehicleSummary = async (events) => {
  if (!events || events.length === 0) return { summary: "No events reported.", tags: [] };

  // Prepare the prompt
  const eventList = events.map(e => 
    `- Date: ${e.dateOccurred.toDateString()}, Type: ${e.eventType}, Source: ${e.reporterId.companyName || 'Unknown'}, Description: "${e.description}"`
  ).join('\n');

  const prompt = `
    You are a neutral AI assistant for a vehicle transparency platform in Lebanon.
    Your task is to summarize the history of a vehicle based ONLY on the reported events below.
    
    RULES:
    1. Be completely neutral and objective. Do not assign fault.
    2. Use phrases like "It was reported that..." or "A report indicates...".
    3. If descriptions conflict, state that there are conflicting reports without taking sides.
    4. Do not speculate beyond the text provided.
    5. Output a JSON object with two fields: "summary" (a paragraph) and "tags" (an array of short strings like "Accident Reported", "Imported", "Clean History" if applicable).

    EVENTS:
    ${eventList}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up markdown code blocks if present
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Generation Error:", error);
    return { summary: "AI summary unavailable at this time.", tags: ["AI Error"] };
  }
};

module.exports = { generateVehicleSummary };
