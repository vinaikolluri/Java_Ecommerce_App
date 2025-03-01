import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import config from '../../config';
import { saveToken } from '../../utils/JWT_Token';
import { useAuth } from '../../Context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setIsAuthenticated, loginBuyer, loginSeller, loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleContinue = e => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email');
      return;
    }
    setError('');
    setShowPassword(true);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${config.apiUrl}/api/users/login`, {
        emailId: email,
        password: password,
      });

      if (response.data) {
        const data = response.data;
        saveToken(data.jwtToken); // Ensure this function stores the token securely
        const userDetails = data.user || data.admin;

        // Ensure roles are assigned securely
        if (userDetails.role === 'Buyer') loginBuyer(userDetails);
        else if (userDetails.role === 'Admin') loginAdmin(userDetails);
        else throw new Error('Unauthorized access');

        setIsAuthenticated(true);
        toast.success('Welcome to  FreshMart! 🎉');
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.responseMessage || 'Invalid credentials';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 -mt-6">
      <div className="max-w-md w-full -mt-10">
        
        <div className="bg-white p-8 border border-gray-300 rounded-lg">
          <h1 className="text-3xl mb-4">Sign in</h1>

          <form onSubmit={showPassword ? handleSubmit : handleContinue}>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">
                Email or mobile phone number
              </label>
              <input
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600"
                disabled={showPassword}
              />
            </div>

            {showPassword && (
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 text-sm py-2 px-4 rounded focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            >
              {showPassword ? 'Sign in' : 'Continue'}
            </button>

            {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

            <p className="mt-4 text-xs text-gray-600">
              By continuing, you agree to Garnimart's{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Conditions of Use
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Notice
              </a>
              .
            </p>
          </form>

          <div className="mt-4">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Need help?
            </a>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative">
              <span className="px-2 bg-gray-100 text-sm text-gray-600">
                New to Garnimart?
              </span>
            </div>
          </div>

          <button className="mt-4 w-full bg-gray-100 hover:bg-gray-200 py-2 px-4 border border-gray-300 rounded text-sm">
            <Link to="/sign-up">Create your Garnimart account</Link>
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signin;
