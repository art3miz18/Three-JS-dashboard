import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import authService from '../../services/authServices';

const LoginForm = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Call the login service
      await authService.login(username, password);
      // Redirect to home page or dashboard after login
      // window.location.href = '/';
      setIsAuthenticated(true);
      navigate('/dashboard');
      // navigate('/add-product');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Wrong login credentials');
    }
  };

  return (
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form class="space-y-6" onSubmit={handleLogin}>
            <div>
              
              <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
              <div class="mt-2">
                <input 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete='on'
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>              
                <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label> 
              <div class="mt-2">
                <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete='on'
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
              </div>
            </div>

            <div>
              <button type="submit" class="inline-flex items-center rounded-md bg-indigo-600 px-8 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Login</button>
            </div>
          </form>
        </div>
    </div>
  );
};

export default LoginForm;
