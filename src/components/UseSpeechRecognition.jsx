import { useEffect, useState } from 'react';

let recognition = null;
if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.lang = 'en-US';
}

function UseSpeechRecognition() {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    if (recognition == null) return;
    recognition.onresult = (event) => { // Remove :SpeechRecognitionEvent
      console.log(event);
      setText(event.results[0][0].transcript);
      recognition.stop();
      setListening(false);
    };
  }, []);

  const start = () => {
    setText('');
    setListening(true);
    recognition.start();
  };

  const stop = () => {
    setListening(false);
    recognition.stop();
  };

  const hasRecognitionSupport = !!recognition;

  return {
    text,
    listening,
    start,
    stop,
    hasRecognitionSupport,
  };
}

export default UseSpeechRecognition;
