// Initialize SpeechRecognition
const recognition = new webkitSpeechRecognition();

// Start recording
recognition.start();

// Wait for user to stop talking
recognition.onresult = (event) => {
	// Get the transcribed text
	const text = event.results[0][0].transcript;

	// Send the text to the OpenAI API
	fetch('https://api.openai.com/v1/engines/davinci/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${secrets.api_key}`
		},
		body: JSON.stringify({
			prompt: text,
			model: 'text-davinci-002',
			max_tokens: 3000,
			stop: '.',
			temperature: 0.5
		})
	})
		.then((response) => response.json())
		.then((data) => {
			// Get the completed text
			const completedText = data.choices[0].text;

			// Convert the text to speech
			const speech = new SpeechSynthesisUtterance(completedText);
			speech.lang = 'tr';
			speech.rate = 1;

			// Play the speech
			window.speechSynthesis.speak(speech);
		});
};