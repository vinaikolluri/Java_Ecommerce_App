import axios from 'axios';
import { motion } from 'framer-motion';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../../config';
import { getToken } from '../../utils/JWT_Token';

// Constants
const MINIMUM_FREE_DELIVERY_AMOUNT = 1000; // Updated to 1000
const DELIVERY_CHARGE = 50;

// PincodeInput Component
const PincodeInput = ({ value, onChange, isLoading }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);

  const fetchPincodeData = debounce(async (pincode) => {
    if (pincode.length !== 6) {
      setSuggestions([]);
      return;
    }

    try {
      setPincodeLoading(true);
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode}`
      );

      if (response.data[0].Status === 'Success') {
        setSuggestions(response.data[0].PostOffice);
      } else {
        setSuggestions([]);
        toast.error('Invalid pincode');
      }
    } catch (error) {
      setSuggestions([]);
      toast.error('Error fetching pincode data');
    } finally {
      setPincodeLoading(false);
    }
  }, 500);

  const handlePincodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    onChange({ target: { name: 'postalCode', value } });

    if (value.length === 6) {
      fetchPincodeData(value);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (postOffice) => {
   // onChange({ target: { name: 'postalCode', value: postOffice.pincode } });
    onChange({ target: { name: 'city', value: postOffice.District } });
    onChange({ target: { name: 'state', value: postOffice.State } });
    onChange({ target: { name: 'street', value: postOffice.Name } });
    onChange({ target: { name: 'country', value: 'India' } });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        name="postalCode"
        value={value}
        onChange={handlePincodeChange}
        maxLength={6}
        pattern="[0-9]{6}"
        inputMode="numeric"
        placeholder="Enter 6-digit pincode"
        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        onFocus={() => setShowSuggestions(true)}
        required
      />
      {(isLoading || pincodeLoading) && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {showSuggestions && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((postOffice, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
              onClick={() => handleSuggestionClick(postOffice)}
            >
              <div className="text-sm font-medium">
                {postOffice.Name}, {postOffice.District}
              </div>
              <div className="text-xs text-gray-500">{postOffice.State}</div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

const usePriceCalculator = (carts, cartAmount) => {
  const [priceDetails, setPriceDetails] = useState({
    subtotal: 0,
    discount: 0,
    deliveryCharge: 0,
    payableAmount: 0,
  });

  useEffect(() => {
    if (!carts || cartAmount === undefined) return;

    // Calculate subtotal from cart items
    const subtotal = carts.reduce(
      (total, cart) => total + cart.product.price * cart.quantity,
      0
    );

    // Calculate discount as the difference between subtotal and cartAmount
    const discount = subtotal - cartAmount;

    // Apply delivery charge based on cart amount
    const deliveryCharge =
      cartAmount > MINIMUM_FREE_DELIVERY_AMOUNT ? 0 : DELIVERY_CHARGE;

    // Calculate final payable amount
    const payableAmount = Number(cartAmount) + deliveryCharge;

    setPriceDetails({
      subtotal,
      discount,
      deliveryCharge,
      payableAmount,
    });
  }, [carts, cartAmount]);

  return priceDetails;
};

// Main Component
const BuyerCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { carts, cartAmount } = location.state || {};
  const [orderId, setOrderId] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const token = getToken();

  const priceDetails = usePriceCalculator(carts, cartAmount);

  const [address, setAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('buyer'));
    if (!userData) {
      toast.error('Please login to place an order.');
      navigate('/sign-in');
      return;
    }
    setUser(userData);
    // Pre-fill name if available
    if (userData.name) {
      setAddress((prev) => ({ ...prev, name: userData.name }));
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (address.phone && !/^[0-9]{10}$/.test(address.phone)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return false;
    }
    if (address.postalCode && !/^[0-9]{6}$/.test(address.postalCode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    setLoading(true);
  
    // Generate a unique order ID (you can use a library like `uuid` or generate it on the server later)
    const newOrderId = `ORDER_${Date.now()}`; // Temporary order ID
  
    // Prepare the order details
    const orderDetails = {
      buyerId: user.id,
      deliveryAddress: `${address.street}, ${address.city}, ${address.state}, ${address.country}`,
      amount: priceDetails.payableAmount,
      buyerName: address.name,
      street: address.street,
      city: address.city,
      state: address.state,
      country: address.country,
      buyerMobileNo: address.phone,
    };
  
    try {
      // Navigate directly to the payment page
      navigate('/order/payment', {
        state: {
          amount: priceDetails.payableAmount,
          deliveryAddress: address,
          orderId: newOrderId,
          orderDetails, // Pass the entire order details if needed
        },
      });
    } catch (error) {
      toast.error('Failed to proceed to payment. Please try again.');
      console.error('Payment navigation error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!carts) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row gap-8"
        >
          {/* Left side - Cart Items */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              {carts.map((cart, index) => (
                <motion.div
                  key={cart.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 mb-4 p-4 border rounded-lg"
                >
                  <Link to={`/product/${cart.product.id}`}>
                    <img
                          src={`${config.apiUrl}/api/products/media/${cart.product.image1}`}
                          alt={cart.product.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  </Link>
                  <div>
                    <h3 className="font-semibold">{cart.product.name}</h3>
                    <p className="text-gray-600">Quantity: {cart.quantity}</p>
                    <p className="text-green-600 font-bold">
                      ₹{cart.product.price.toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Price Breakdown */}
              <div className="mt-6 bg-gray-50 p-4 rounded-lg space-y-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Price Details
                </h3>
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{priceDetails.subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>- ₹{priceDetails.discount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge</span>
                  <span>₹{priceDetails.deliveryCharge.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Payable</span>
                    <span>₹{priceDetails.payableAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right side - Checkout Form */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-lg p-4"
            >
              <h2 className="text-2xl text-center font-bold mb-4">
                Shipping Details
              </h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={address.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={address.phone}
                      onChange={handleChange}
                      required
                      maxLength={10}
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      placeholder="10-digit mobile number"
                      className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Pincode
                    </label>
                    <PincodeInput
                      value={address.postalCode}
                      onChange={handleChange}
                      isLoading={pincodeLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={address.street}
                      onChange={handleChange}
                      required
                      placeholder="House/Flat No., Building, Street"
                      className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleChange}
                      required
                      placeholder="Enter city"
                      className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={address.state}
                      onChange={handleChange}
                      required
                      placeholder="Enter state"
                      className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={address.country}
                      onChange={handleChange}
                      required
                      placeholder="Enter country"
                      className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Order Summary for Mobile */}
                <div className="lg:hidden mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Order Total</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    ₹{priceDetails.payableAmount.toFixed(2)}
                  </p>
                  {priceDetails.discount > 0 && (
                    <p className="text-green-600 text-sm">
                      You saved ₹{priceDetails.discount.toFixed(2)}!
                    </p>
                  )}
                </div>

                {/* Delivery Time Estimate */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800">
                    Estimated Delivery Time
                  </h4>
                  <p className="text-sm text-blue-600">
                    {address.postalCode
                      ? '3-5 business days'
                      : 'Enter pincode to check delivery time'}
                  </p>
                </div>

                {/* Place Order Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </div>
                  ) : (
                    `Place Order ₹ ${priceDetails.payableAmount.toFixed(2)} `
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default BuyerCheckout;