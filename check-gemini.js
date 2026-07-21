require('dotenv').config({ path: '.env.local' });
fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`)
  .then(r => r.json())
  .then(data => {
    if (data.models) {
      console.log(data.models.map(m => m.name).filter(n => n.includes('1.5')));
    } else {
      console.log("Error:", data);
    }
  })
  .catch(console.error);
