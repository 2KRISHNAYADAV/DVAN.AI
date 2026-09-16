const apiKey = process.env.VITE_GEMINI_API_KEY;

async function checkModels() {
  const url = "https://generativelanguage.googleapis.com/v1beta/models?key=" + apiKey;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const err = await response.text();
      console.log("Error listing models:", response.status, err);
      return;
    }
    const data = await response.json();
    console.log("Available models:");
    data.models.forEach(m => console.log(m.name));
  } catch(e) {
    console.log("Fetch error:", e);
  }
}
checkModels();
