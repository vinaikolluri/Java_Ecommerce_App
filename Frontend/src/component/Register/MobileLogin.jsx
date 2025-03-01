import React, { useState } from 'react';
import axios from 'axios';
import { saveToken } from '../../utils/JWT_Token';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import config from '../../config';

const MobileLogin = () => {
  const [mobileNo, setMobileNo] = useState('+91');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated, loginBuyer, loginSeller, loginAdmin } = useAuth();

  const handleMobileChange = event => {
    setMobileNo(event.target.value);
  };

  const handleOtpChange = event => {
    setOtp(event.target.value);
  };

  const handleSendOtp = async event => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${config.apiUrl}/B2B/buyer&seller/mobilesendOtp`,
        null,
        {
          params: { mobileNo },
        },
      );

      if (response.status === 200) {
        setIsOtpSent(true);
        toast.success('OTP sent successfully!');
      } else {
        toast.error('Failed to send OTP. Please check your mobile number.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error.message);
      toast.error(`Error sending OTP: ${error.message}`);
    }
  };

  const handleValidateOtp = async event => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${config.apiUrl}/B2B/buyer&seller/mobilevalidateOtp`,
        null,
        {
          params: { mobile: mobileNo, otp },
        },
      );

      if (response.status === 200) {
        const token = response.data.jwtToken;
        const userDetails =
          response.data.buyer || response.data.seller || response.data.admin;

        if (!userDetails) {
          throw new Error('User details not found in the response');
        }

        saveToken(token);
        localStorage.setItem('jwtToken', token);

        if (userDetails.role === 'buyer') {
          loginBuyer(userDetails);
        } else if (userDetails.role === 'seller') {
          loginSeller(userDetails);
        } else if (userDetails.role === 'admin') {
          loginAdmin(userDetails);
        } else {
          throw new Error('User role is undefined or unrecognized');
        }

        setIsAuthenticated(true);
        setMobileNo('+91');
        setOtp('');

        toast.success('Login successful!');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        toast.error('OTP validation failed. Please try again.');
      }
    } catch (error) {
      console.error('Error validating OTP:', error.message);
      toast.error(`Error validating OTP: ${error.message}`);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-end bg-cover bg-center"
      style={{
        backgroundImage:
          'url(https://as1.ftcdn.net/v2/jpg/02/92/90/56/1000_F_292905667_yFUJNJPngYeRNlrRL4hApHWxuYyRY4kN.jpg)',
      }}
    >
      <div className="max-w-md w-full bg-transparent p-8 rounded-lg shadow-md m-8">
        <div className="flex justify-center mb-6">
          <FaUserCircle size={50} className="text-gray-700" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">
          Sign In with OTP
        </h2>
        {!isOtpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label
                htmlFor="mobileNo"
                className="block text-gray-700 font-bold mb-2"
              >
                Mobile Number
              </label>
              <input
                type="text"
                id="mobileNo"
                name="mobileNo"
                value={mobileNo}
                onChange={handleMobileChange}
                required
                placeholder="Enter your mobile number"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none"
              >
                Send OTP
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleValidateOtp} className="space-y-4">
            <div>
              <label
                htmlFor="otp"
                className="block text-gray-700 font-bold mb-2"
              >
                OTP
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={handleOtpChange}
                required
                placeholder="Enter the OTP"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none"
              >
                Validate OTP
              </button>
            </div>
          </form>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default MobileLogin;
