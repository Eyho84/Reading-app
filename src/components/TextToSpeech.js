import React from 'react';

function TextToSpeech({ text }) {
  const speak = () => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'nb-NO'; // Norwegian
      utterance.rate = 0.8; // Slightly slower for children
      
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Beklager, nettleseren din støtter ikke tekst-til-tale');
    }
  };

  return (
    <button onClick={speak} style={styles.button}>
      🔊 Les opp
    </button>
  );
}

const styles = {
  button: {
    fontSize: '1.2rem',
    padding: '10px 25px',
    backgroundColor: '#9b59b6',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
};

export default TextToSpeech;