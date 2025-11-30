import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase/config';
import Login from './components/Login';
import Activity from './components/Activity';
import TextToSpeech from './components/TextToSpeech';
import activities from './data/activities';

function App() {
  const [userCode, setUserCode] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [results, setResults] = useState([]);
  const [finished, setFinished] = useState(false);

  const handleLogin = (code) => {
    setUserCode(code);
  };

  const handleActivityComplete = async (answer) => {
    const newResults = [...results, {
      activityId: activities[currentPage].id,
      type: activities[currentPage].type,
      answer: answer,
      timestamp: new Date().toISOString(),
    }];
    setResults(newResults);

    if (currentPage < activities.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      // Save results to Firebase
      try {
        await addDoc(collection(db, 'results'), {
          userCode: userCode,
          results: newResults,
          completedAt: Timestamp.now(),
        });
        console.log('Results saved!');
      } catch (error) {
        console.error('Error saving results:', error);
      }
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentPage(0);
    setResults([]);
    setFinished(false);
  };

  const handleLogout = () => {
    setUserCode(null);
    setCurrentPage(0);
    setResults([]);
    setFinished(false);
  };

  // Show login screen
  if (!userCode) {
    return <Login onLogin={handleLogin} />;
  }

  // Show finished screen
  if (finished) {
    const correctCount = results.filter(r => {
      if (Array.isArray(r.answer)) {
        return r.answer.every(a => a.correct);
      }
      return r.answer.correct;
    }).length;

    return (
      <div style={styles.container}>
        <h1 style={styles.title}>🎉 Bra jobba!</h1>
        <p style={styles.subtitle}>Du er ferdig med alle oppgavene</p>
        <p style={styles.score}>
          Du fikk {correctCount} av {results.length} riktig
        </p>
        <div style={styles.buttonRow}>
          <button onClick={handleRestart} style={styles.button}>
            Prøv igjen
          </button>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logg ut
          </button>
        </div>
      </div>
    );
  }

  // Show activity
  const currentActivity = activities[currentPage];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <p style={styles.progress}>
          Oppgave {currentPage + 1} av {activities.length}
        </p>
        <p style={styles.userCode}>Kode: {userCode}</p>
      </div>

      <div style={styles.speechButton}>
        <TextToSpeech text={currentActivity.instruction} />
      </div>

      <Activity
        key={currentActivity.id}
        activity={currentActivity}
        onComplete={handleActivityComplete}
      />

      <div style={styles.pageIndicator}>
        {activities.map((_, index) => (
          <span
            key={index}
            style={{
              ...styles.dot,
              backgroundColor: index === currentPage ? '#3498db' : '#bdc3c7',
            }}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f7ff',
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  progress: {
    fontSize: '1.2rem',
    color: '#7f8c8d',
  },
  userCode: {
    fontSize: '1rem',
    color: '#95a5a6',
  },
  speechButton: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  pageIndicator: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '40px',
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
  },
  title: {
    fontSize: '3rem',
    textAlign: 'center',
    marginTop: '100px',
  },
  subtitle: {
    fontSize: '1.5rem',
    textAlign: 'center',
    color: '#7f8c8d',
  },
  score: {
    fontSize: '2rem',
    textAlign: 'center',
    color: '#2c3e50',
    marginTop: '30px',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '40px',
  },
  button: {
    fontSize: '1.3rem',
    padding: '15px 40px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  logoutButton: {
    fontSize: '1.3rem',
    padding: '15px 40px',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
  },
};

export default App;