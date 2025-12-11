exports.handler = async function(event, context) {
  try {
    // 1. Get the Key
    const API_KEY = process.env.MY_SECRET_KEY;
    if (!API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: "Missing API Key" }) };
    }

    // 2. The Request Body (User's Prompt)
    const requestBody = JSON.parse(event.body);
    const userPrompt = requestBody.prompt;

    // 3. The "Old Faithful" URL (Gemini Pro)
    // We switched from 'flash' to 'pro' because it is more stable.
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

    // 4. The Data to send to Google
    const requestData = {
      contents: [{
        parts: [{ text: userPrompt }]
      }]
    };

    // 5. Call Google
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData)
    });

    const data = await response.json();

    // 6. Check if Google gave an error
    if (!response.ok) {
      console.log("Google Error:", data); // This logs to Netlify Console
      return { 
        statusCode: response.status, 
        body: JSON.stringify({ error: data.error.message }) 
      };
    }

    // 7. Success
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.log("Server Error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.toString() }) };
  }
};
