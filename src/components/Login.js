import React, { useState } from 'react';

function Login({ onLogin }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (code.trim().length < 2) {
      setError('Skriv inn en kode');
      return;
    }
    onLogin(code.trim());
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📚 Leseøving</h1>
      <p style={styles.subtitle}>Skriv inn koden din for å starte</p>
      
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="Din kode"
        style={styles.input}
      />
      
      {error && <p style={styles.error}>{error}</p>}
      
      <button onClick={handleSubmit} style={styles.button}>
        Start
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f7ff',
    padding: '20px',
  },
  title: {
    fontSize: '3rem',
    color: '#2c3e50',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#7f8c8d',
    marginBottom: '30px',
  },
  input: {
    fontSize: '2rem',
    padding: '15px 30px',
    textAlign: 'center',
    borderRadius: '10px',
    border: '3px solid #3498db',
    marginBottom: '20px',
    width: '250px',
  },
  button: {
    fontSize: '1.5rem',
    padding: '15px 60px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  error: {
    color: '#e74c3c',
    marginBottom: '10px',
  },
};

export default Login;