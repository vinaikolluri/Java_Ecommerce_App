
import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSpinner, FaEnvelope, FaKey } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import config from '../../config'

const Forgotpassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false); // Track whether OTP has been sent
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleOtpChange = (event) => {
    setOtp(event.target.value);
  };

  const handleSendOtp = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const apiUrl = `${config.apiUrl}/B2B/buyer&seller/requestOtp`; // Replace with your backend API endpoint
      const response = await axios.post(apiUrl, {
        email
      });

      if (response.status === 200) {
        toast.success('OTP sent to your email.');
        setOtpSent(true); // Mark OTP as sent
      } else {
        toast.error('Failed to send OTP. Please try again later.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('Error sending OTP. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const apiUrl = `${config.apiUrl}/B2B/buyer&seller/validateOtp`; // Replace with your backend API endpoint
      const response = await axios.post(apiUrl, {
        email,
        otp
      }
    );

      if (response.status === 200) {
        toast.success('OTP verified successfully. Proceed with password reset.');
        // Redirect or navigate to password reset page
        setTimeout(() => {
          navigate('/user/change-password');
        }, 2000);
      } else {
        toast.error('Failed to verify OTP. Please check your OTP and try again.');
      }
    } catch (error) {


      if (error.response) {
        toast.error(`Error verifying OTP: ${error.response.data.
          responseMessage
          }`);
        console.error('Error verifying OTP:', error.response.data);
      } else {
        toast.error('Error verifying OTP');
        console.error('Error verifying OTP:', error);
      }


    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url('https://e1.pxfuel.com/desktop-wallpaper/352/685/desktop-wallpaper-why-this-is-not-the-right-time-for-ecommerce-companies-to-go-app-only-e-commerce.jpg')` }}>
      <div className="max-w-md mx-auto p-6 bg-transparent shadow-md rounded-lg mb-8">
        <h2 className="text-5xl font-bold text-center text-neutral-200 mb-6">Forgot Password</h2>
        <form className="space-y-4">
          {/* Email */}
          <div className="flex items-center border-b border-gray-300 py-2">
            <FaEnvelope className="text-gray-600 mr-2" />
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              required
              placeholder="Enter your email"
              className="w-full p-2 focus:outline-none"
            />
          </div>

          {/* Send OTP Button */}
          {!otpSent && ( // Render Send OTP button if OTP has not been sent
            <div>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading || !email}
                className={`w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none flex items-center justify-center ${loading ? 'opacity-50 cursor-wait' : ''}`}
              >
                {loading ? <FaSpinner className="animate-spin mr-2" /> : null}
                Send OTP
              </button>
            </div>
          )}

          {/* OTP Input */}
          {otpSent && ( // Render OTP input only if OTP has been sent
            <div className="flex items-center border-b border-gray-300 py-2">
              <FaKey className="text-gray-600 mr-2" />
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={handleOtpChange}
                required
                placeholder="Enter OTP"
                className="w-full p-2 focus:outline-none"
              />
            </div>
          )}

          {/* Verify OTP Button */}
          {otpSent && ( // Render verify button only if OTP has been sent
            <div>
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading || !otp}
                className={`w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none flex items-center justify-center ${loading ? 'opacity-50 cursor-wait' : ''}`}
              >
                {loading ? <FaSpinner className="animate-spin mr-2" /> : null}
                Verify OTP
              </button>
            </div>
          )}
        </form>

        {/* Toast Container for displaying notifications */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default Forgotpassword;
