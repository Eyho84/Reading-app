import React, { useState } from 'react';

function Activity({ activity, onComplete }) {
  const [result, setResult] = useState(null);

  if (activity.type === 'match-picture-to-word') {
    return (
      <MatchPictureToWord 
        activity={activity} 
        onComplete={onComplete}
        result={result}
        setResult={setResult}
      />
    );
  }

  if (activity.type === 'arrange-letters') {
    return (
      <ArrangeLetters 
        activity={activity} 
        onComplete={onComplete}
        result={result}
        setResult={setResult}
      />
    );
  }

  return <p>Ukjent aktivitetstype</p>;
}

function MatchPictureToWord({ activity, onComplete, result, setResult }) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [matches, setMatches] = useState({});
  const [availableImages, setAvailableImages] = useState(activity.items.map(i => i.id));

  const handleDragStart = (itemId) => {
    setDraggedItem(itemId);
  };

  const handleDrop = (wordItemId) => {
    if (!draggedItem) return;

    const newMatches = { ...matches, [wordItemId]: draggedItem };
    setMatches(newMatches);
    setAvailableImages(availableImages.filter(id => id !== draggedItem));
    setDraggedItem(null);

    // Check if all matches are done
    if (Object.keys(newMatches).length === activity.items.length) {
      // Check answers
      const correct = activity.items.every(item => newMatches[item.id] === item.id);
      setResult(correct ? 'correct' : 'incorrect');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleNext = () => {
    const answers = activity.items.map(item => ({
      word: item.word,
      expected: item.id,
      answered: matches[item.id],
      correct: matches[item.id] === item.id,
    }));
    onComplete(answers);
  };

  const handleReset = () => {
    setMatches({});
    setAvailableImages(activity.items.map(i => i.id));
    setResult(null);
  };

  return (
    <div style={styles.container}>
      <p style={styles.instruction}>{activity.instruction}</p>

      {/* Draggable images */}
      <div style={styles.imagesRow}>
        {availableImages.map(itemId => {
          const item = activity.items.find(i => i.id === itemId);
          return (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(item.id)}
              style={styles.imageBox}
            >
              <span style={styles.emoji}>{item.image}</span>
            </div>
          );
        })}
      </div>

      {/* Drop zones with words */}
      <div style={styles.wordsRow}>
        {activity.items.map(item => (
          <div
            key={item.id}
            onDrop={() => handleDrop(item.id)}
            onDragOver={handleDragOver}
            style={{
              ...styles.wordBox,
              backgroundColor: matches[item.id] 
                ? (matches[item.id] === item.id ? '#d4edda' : '#f8d7da')
                : '#fff',
            }}
          >
            <p style={styles.word}>{item.word}</p>
            {matches[item.id] && (
              <span style={styles.emoji}>
                {activity.items.find(i => i.id === matches[item.id])?.image}
              </span>
            )}
          </div>
        ))}
      </div>

      {result && (
        <div style={styles.resultBox}>
          {result === 'correct' ? (
            <p style={styles.correct}>🎉 Riktig!</p>
          ) : (
            <p style={styles.incorrect}>Prøv igjen!</p>
          )}
          <div style={styles.buttonRow}>
            {result === 'incorrect' && (
              <button onClick={handleReset} style={styles.retryButton}>
                Prøv igjen
              </button>
            )}
            <button onClick={handleNext} style={styles.nextButton}>
              Neste →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ArrangeLetters({ activity, onComplete, result, setResult }) {
  const [availableLetters, setAvailableLetters] = useState([...activity.shuffledLetters]);
  const [placedLetters, setPlacedLetters] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDrop = () => {
    if (draggedIndex === null) return;

    const letter = availableLetters[draggedIndex];
    const newAvailable = availableLetters.filter((_, i) => i !== draggedIndex);
    const newPlaced = [...placedLetters, letter];

    setAvailableLetters(newAvailable);
    setPlacedLetters(newPlaced);
    setDraggedIndex(null);

    // Check if word is complete
    if (newPlaced.length === activity.word.length) {
      const formed = newPlaced.join('');
      const correct = formed === activity.word;
      setResult(correct ? 'correct' : 'incorrect');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleNext = () => {
    const formed = placedLetters.join('');
    onComplete({
      word: activity.word,
      answered: formed,
      correct: formed === activity.word,
    });
  };

  const handleReset = () => {
    setAvailableLetters([...activity.shuffledLetters]);
    setPlacedLetters([]);
    setResult(null);
  };

  return (
    <div style={styles.container}>
      <p style={styles.instruction}>{activity.instruction}</p>

      {/* Available letters */}
      <div style={styles.lettersRow}>
        {availableLetters.map((letter, index) => (
          <div
            key={index}
            draggable
            onDragStart={() => handleDragStart(index)}
            style={styles.letterBox}
          >
            {letter}
          </div>
        ))}
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={styles.dropZone}
      >
        {placedLetters.length === 0 ? (
          <p style={styles.placeholder}>Dra bokstavene hit</p>
        ) : (
          <div style={styles.placedLetters}>
            {placedLetters.map((letter, index) => (
              <span key={index} style={styles.placedLetter}>{letter}</span>
            ))}
          </div>
        )}
      </div>

      {result && (
        <div style={styles.resultBox}>
          {result === 'correct' ? (
            <p style={styles.correct}>🎉 Riktig!</p>
          ) : (
            <p style={styles.incorrect}>Ikke riktig. Svaret er: {activity.word}</p>
          )}
          <div style={styles.buttonRow}>
            {result === 'incorrect' && (
              <button onClick={handleReset} style={styles.retryButton}>
                Prøv igjen
              </button>
            )}
            <button onClick={handleNext} style={styles.nextButton}>
              Neste →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  },
  instruction: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    marginBottom: '30px',
  },
  imagesRow: {
    display: 'flex',
    gap: '20px',
    marginBottom: '40px',
  },
  imageBox: {
    width: '100px',
    height: '100px',
    backgroundColor: '#fff',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'grab',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    border: '3px solid #3498db',
  },
  emoji: {
    fontSize: '3rem',
  },
  wordsRow: {
    display: 'flex',
    gap: '20px',
  },
  wordBox: {
    width: '120px',
    minHeight: '150px',
    borderRadius: '15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '3px dashed #95a5a6',
    padding: '10px',
  },
  word: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '10px',
  },
  lettersRow: {
    display: 'flex',
    gap: '15px',
    marginBottom: '40px',
  },
  letterBox: {
    width: '70px',
    height: '70px',
    backgroundColor: '#3498db',
    color: 'white',
    fontSize: '2rem',
    fontWeight: 'bold',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'grab',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  dropZone: {
    width: '350px',
    minHeight: '100px',
    border: '3px dashed #95a5a6',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  placeholder: {
    color: '#95a5a6',
    fontSize: '1.2rem',
  },
  placedLetters: {
    display: 'flex',
    gap: '10px',
  },
  placedLetter: {
    width: '60px',
    height: '60px',
    backgroundColor: '#2ecc71',
    color: 'white',
    fontSize: '2rem',
    fontWeight: 'bold',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultBox: {
    marginTop: '30px',
    textAlign: 'center',
  },
  correct: {
    fontSize: '2rem',
    color: '#27ae60',
  },
  incorrect: {
    fontSize: '1.5rem',
    color: '#e74c3c',
  },
  buttonRow: {
    display: 'flex',
    gap: '15px',
    marginTop: '20px',
    justifyContent: 'center',
  },
  nextButton: {
    fontSize: '1.2rem',
    padding: '12px 40px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  retryButton: {
    fontSize: '1.2rem',
    padding: '12px 40px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
  },
};

export default Activity;