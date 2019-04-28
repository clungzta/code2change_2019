/* eslint-disable no-use-before-define */
// From Mozilla Web Speech Demos https://github.com/mdn/web-speech-api/tree/gh-pages

var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
// var SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList
// var SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent

export default function testSpeech (doneCB, latestSpeechResult) {
  // speech starts transcribing immediately
  // doneCB is called when stopped
  console.log('At testSpeech()!')

  var recognition = new SpeechRecognition()
  recognition.lang = 'en-US'
  recognition.interimResults = true
  recognition.maxAlternatives = 1

  recognition.start()

  recognition.onresult = function (event) {
    latestSpeechResult = event.results[0][0].transcript.toLowerCase()
    console.log('Speech received: ' + latestSpeechResult + '.')
    console.log(latestSpeechResult)
    console.log('Confidence: ' + event.results[0][0].confidence)

    // Successful transcription!
    // doneCB(1, speechResult)
  }

  recognition.onspeechend = function () {
    recognition.stop()
    // doneCB(0, null)
  }

  recognition.onerror = function (event) {
    doneCB(0, null)
    console.log('Error occurred in recognition: ' + event.error)
  }

  recognition.onaudiostart = function (event) {
    // Fired when the user agent has started to capture audio.
    console.log('SpeechRecognition.onaudiostart')
  }

  recognition.onaudioend = function (event) {
    // Fired when the user agent has finished capturing audio.
    console.log('SpeechRecognition.onaudioend')
  }

  recognition.onend = function (event) {
    // Fired when the speech recognition service has disconnected.
    console.log('SpeechRecognition.onend')
    doneCB(1, latestSpeechResult)
  }

  recognition.onnomatch = function (event) {
    // Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
    console.log('SpeechRecognition.onnomatch')
  }

  recognition.onsoundstart = function (event) {
    // Fired when any sound — recognisable speech or not — has been detected.
    console.log('SpeechRecognition.onsoundstart')
  }

  recognition.onsoundend = function (event) {
    // Fired when any sound — recognisable speech or not — has stopped being detected.
    console.log('SpeechRecognition.onsoundend')
  }

  recognition.onspeechstart = function (event) {
    // Fired when sound that is recognised by the speech recognition service as speech has been detected.
    console.log('SpeechRecognition.onspeechstart')
  }
  recognition.onstart = function (event) {
    // Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
    console.log('SpeechRecognition.onstart')
  }
}
