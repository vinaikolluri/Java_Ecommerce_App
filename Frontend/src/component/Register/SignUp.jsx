import React, { useState } from 'react';
import axios from 'axios';
import config from '../../config';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [step, setStep] = useState(1); // 1: Initial form, 2: OTP verification
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    password: '',
    otp: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleSendOTP = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(
        `${config.apiUrl}/api/users/sendotp?email=${formData.email}`,
      );
      setStep(2);
      setSuccess('OTP sent successfully! Please check your email.');
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(
        `${config.apiUrl}/api/users/validateotp?email=${formData.email}&otp=${formData.otp}`,
      );

      // If OTP is verified, proceed with registration
      const response = await axios.post(`${config.apiUrl}/api/users/register`, {
        ...formData,
        role: 'USER',
        status: 'ACTIVE',
      });

      if (!response.data) throw new Error('Registration failed');
      setSuccess('Registration successful!');
      alert('You are Register Sucessfull in Garnimart')
      navigate('/sign-in');
    } catch (err) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full h-12 px-4 py-2 text-base border border-gray-300 rounded focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600';

  const StatusMessage = ({ error, success }) => {
    if (error) {
      return (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      );
    }
    if (success) {
      return (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle2 className="w-4 h-4" />
          <span>{success}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full">
         

        <div className="bg-white p-8 border border-gray-300 rounded-lg">
          <h1 className="text-3xl mb-6 text-center font-semibold">
            Create Account
          </h1>

          {step === 1 ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={e =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={e =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  value={formData.mobileNumber}
                  onChange={e =>
                    setFormData({ ...formData, mobileNumber: e.target.value })
                  }
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={e =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={e =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className={inputClass}
                  minLength={6}
                  required
                />
                <div className="mt-1 text-xs text-gray-600">
                  Passwords must be at least 6 characters.
                </div>
              </div>

              <StatusMessage error={error} success={success} />

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-base font-medium py-2 px-4 rounded focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                {loading ? 'Sending OTP...' : 'Continue'}
              </button>

              <p className="text-xs text-gray-600">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Use
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  placeholder="Enter OTP from your email"
                  value={formData.otp}
                  onChange={e =>
                    setFormData({ ...formData, otp: e.target.value })
                  }
                  className={inputClass}
                  required
                />
              </div>

              <StatusMessage error={error} success={success} />

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-base font-medium py-2 px-4 rounded focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                {loading ? 'Verifying...' : 'Create Account'}
              </button>

              <button
                type="button"
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full text-sm text-blue-600 hover:underline"
              >
                Resend OTP
              </button>
            </form>
          )}

          <div className="mt-6 text-sm text-center">
            Already have an account?{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
