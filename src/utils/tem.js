let currentUtterance = null;

export function speak(text, onEnd, onStart) {
  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.onstart = () => {
    onStart && onStart();
  };

  utterance.onend = () => {
    onEnd && onEnd();
  };

  currentUtterance = utterance;
  speechSynthesis.speak(utterance);
}

export function pauseSpeech() {
  if (speechSynthesis.speaking) {
    speechSynthesis.pause();
  }
}

export function resumeSpeech() {
  if (speechSynthesis.paused) {
    speechSynthesis.resume();
  }
}
