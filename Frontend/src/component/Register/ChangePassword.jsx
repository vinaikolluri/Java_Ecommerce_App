import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import config from '../../config'

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const { userId } = useParams(); // Assuming userId is passed as a URL parameter

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    try {
      const apiUrl = `${config.apiUrl}/B2B/buyer&seller/changePassword/${userId}`;
      const response = await axios.put(apiUrl, {
        newPassword,
        confirmPassword
      });

      if (response.status === 200) {
        // Show success message using toast
        toast.success('Password changed successfully!');

        // Delay navigation by 1 second to show the success message
        setTimeout(() => {
          navigate('/sign-in');
        }, 1000);
      } else {
        console.error('Password change failed');
        // Handle failure, show error message, etc.
        toast.error('Password change failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during password change:', error);
      // Handle error, show error message, etc.
      toast.error('Error during password change. Please try again later.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* New Password */}
        <div>
          <label htmlFor="newPassword" className="block text-gray-700 font-bold mb-2">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={newPassword}
            onChange={handleNewPasswordChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-gray-700 font-bold mb-2">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Change Password Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Change Password
          </button>
        </div>
      </form>

      {/* Toast Container for displaying notifications */}
      <ToastContainer />
    </div>
  );
};

export default ChangePassword;
