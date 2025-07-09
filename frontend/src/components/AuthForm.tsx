"use client";

import React, { useState } from 'react';
import api from '../lib/api';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onAuthSuccess: (user: any) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onAuthSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const payload = mode === 'login' ? { email, password } : { username, email, password };
      const response = await api.post(endpoint, payload);
      onAuthSuccess(response.data);
      localStorage.setItem('token', response.data.token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded shadow">
      {mode === 'signup' && (
        <div className="mb-4">
          <label htmlFor="username" className="block mb-1 font-semibold">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      )}
      <div className="mb-4">
        <label htmlFor="email" className="block mb-1 font-semibold">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block mb-1 font-semibold">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <button type="submit" className="w-full bg-black text-white py-2 rounded">
        {mode === 'login' ? 'Login' : 'Sign Up'}
      </button>
    </form>
  );
};

export default AuthForm;
