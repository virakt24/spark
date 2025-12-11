exports.handler = async function(event, context) {
  // 1. Get your secret key from Netlify Environment Variables
  const API_KEY = process.env.MY_SECRET_KEY; 

  // 2. The Gemini API URL (Using the Flash model)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  // 3. Get the user's prompt from the HTML request
  // (We assume the HTML sends a body like { "prompt": "Hello" })
  const requestBody = JSON.parse(event.body);
  const userPrompt = requestBody.prompt;

  // 4. Prepare the data structure Gemini expects
  const requestData = {
    contents: [{
      parts: [{ text: userPrompt }]
    }]
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestData)
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};