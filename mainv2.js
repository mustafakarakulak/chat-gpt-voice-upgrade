const recognition = new webkitSpeechRecognition();
recognition.onerror = (event) => {
	console.error('There was an error with the speech recognition: ', event.error);
};

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
		.then((response) => {
			if (!response.ok) {
				throw new Error(`API error: ${response.status} - ${response.statusText}`);
			}
			return response.json();
		})
		.then((data) => {
			// Get the completed text
			const completedText = data.choices[0].text;

			// Convert the text to speech
			const speech = new SpeechSynthesisUtterance(completedText);
			speech.lang = 'tr';
			speech.rate = 1;

			// Play the speech
			window.speechSynthesis.speak(speech);
		})
		.catch((error) => {
			console.error(error);
		});
};


// Bu kod, OpenAI API'yi fetch işlevi aracılığıyla çağırarak kullanıyor. 
//fetch işlevi, belirli bir URL'ye HTTP isteği yapmak için kullanılır. 
//Bu kod içinde, OpenAI API'nin tamamlama işlevini kullanmak için 
//https://api.openai.com/v1/engines/davinci/completions adresine bir POST 
//isteği yapılıyor. Bu isteğin içeriğinde, kullanıcının konuşmasının 
//transkripti (prompt), kullanılacak model (model), 
//maksimum token sayısı (max_tokens), tamamlama işlemi 
//sonlandırılıncaya kadar beklenen karakter (stop) ve modelin 
//olasılık dağılımının sıcaklığı (temperature) gibi bilgiler yer alıyor. 
//Bu bilgiler, OpenAI API'nin ne yapması gerektiğini ve nasıl yapması 
//gerektiğini belirtir. API yanıtı, fetch işlevinin then metodu aracılığıyla 
//alınır ve JSON formatında döndürülür. Daha sonra, tamamlanan metin 
//(data.choices[0].text) kullanılarak sesli cevap oluşturulur.