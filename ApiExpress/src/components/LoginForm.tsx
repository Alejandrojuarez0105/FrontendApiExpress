// src/components/LoginForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);  // Estado para mostrar u ocultar la contraseña

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validación de ejemplo
    if (email === 'test@example.com' && password === 'password') {
      navigate('/usuario_test'); // Redirige al usuario a la página de usuario después del login
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="login-form">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'} // Si showPassword es true, el tipo es "text", de lo contrario es "password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)} // Al hacer clic cambia el estado para mostrar u ocultar la contraseña
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default LoginForm;
