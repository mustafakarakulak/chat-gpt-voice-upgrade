import speech_recognition as sr
import requests
from gtts import gTTS
import os

# initialize recognizer class (for recognizing the speech)
r = sr.Recognizer()

try:
    # Reading Microphone as source
    # listening the speech and store in audio_text variable
    with sr.Microphone() as source:
        print("Talk")
        audio_text = r.listen(source)
        print("Time over, thanks")

    # recoginize_() method will throw a request error if the API is unreachable, hence using exception handling

    # using google speech recognition
    print("Text: "+r.recognize_google(audio_text, language ='tr-TR'))
    mytext = r.recognize_google(audio_text, language ='tr-TR')
    # sending post request and saving response as response object
    response = requests.post('https://chat.openai.com/chat', json={
        'prompt': mytext,
        'model': 'text-davinci-002',
    })
    # extracting response text
    data = response.text
    print("Response: "+data)
    # Language in which you want to convert 
    language = 'tr'
    # Passing the text and language to the engine, 
    # here we have marked slow=False. Which tells 
    # the module that the converted audio should 
    # have a high speed
    myobj = gTTS(text=data, lang=language, slow=False)
    # Saving the converted audio in a mp3 file named
    # welcome 
    myobj.save("output.mp3")
    # Playing the converted file
    os.system("start output.mp3")

except sr.RequestError as e:
    print("Could not request results; {0}".format(e))

except sr.UnknownValueError:
    print("unknown error occured")
except Exception as e:
    print(e)