import axios from 'axios';
import { motion } from 'framer-motion';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../../config';
import { getToken } from '../../utils/JWT_Token';

// PincodeInput Component
const PincodeInput = ({ value, onChange, isLoading }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);

  const fetchPincodeData = debounce(async pincode => {
    if (pincode.length !== 6) {
      setSuggestions([]);
      return;
    }

    try {
      setPincodeLoading(true);
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode}`,
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

  const handlePincodeChange = e => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    onChange({ target: { name: 'postalCode', value } });

    if (value.length === 6) {
      fetchPincodeData(value);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = postOffice => {
    onChange({ target: { name: 'postalCode', value } });
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

// Main Component
const OrderProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};
  const token = getToken();

  // Validate product existence
  if (!product) {
    toast.error('Product details are missing');
    navigate(`/product/${product.id}`);
    return null;
  }
  // State Management
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);

  // Quantity Management with Advanced Validations
  const [quantity, setQuantity] = useState({
    value: product.minQuantity,
    error: '',
  });

  const [totalAmount, setTotalAmount] = useState(
    product ? product.price * quantity : 0,
  );

  // Price Calculation
  const [priceDetails, setPriceDetails] = useState({
    subtotal: product ? product.price * quantity : 0,
    discount: 0,
    deliveryCharge: 0,
    payableAmount: product ? product.price * quantity : 0,
  });

  // Address State
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
      setAddress(prev => ({ ...prev, name: userData.name }));
    }
  }, [navigate]);

  // Price Calculation Effect
  useEffect(() => {
    if (product) {
      const calculatePriceDetails = () => {
        const subtotal = product.price * quantity.value;
        const discount = subtotal > 1000 ? subtotal * 0.1 : 0;
        const deliveryCharge = subtotal > 500 ? 0 : 250;

        return {
          subtotal,
          discount,
          deliveryCharge,
          payableAmount: subtotal - discount + deliveryCharge,
        };
      };

      setPriceDetails(calculatePriceDetails());
    }
  }, [quantity.value, product]);

  // Quantity Change Handler with Validation
  const handleChange = e => {
    const { name, value } = e.target;
    setAddress(prev => ({
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

  // Quantity Change Handler with Validation
  const handleQuantityChange = e => {
    const newQuantity = Number(e.target.value);

    // Validate quantity against bulk pricing
    let error = '';
    if (newQuantity < product.bulkPricing.minQuantity) {
      error = `Minimum order quantity is ${product.bulkPricing.minQuantity}`;
    }
    if (
      product.bulkPricing.maxQuantity &&
      newQuantity > product.bulkPricing.maxQuantity
    ) {
      error = `Maximum order quantity is ${product.totalQuantity}`;
    }

    setQuantity({
      value: newQuantity,
      error: error,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (quantity.value < product.bulkPricing.minQuantity) {
      alert(`Minimum order quantity is ${product.bulkPricing.minQuantity}`);
      return;
    }

    if (
      product.bulkPricing.maxQuantity &&
      quantity.value > product.bulkPricing.maxQuantity
    ) {
      alert(`Maximum order quantity is ${product.totalQuantity}`);
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    const orderDetails = {
      buyerId: user.id,
      productId:product.id,
      deliveryAddress: `${address.street}, ${address.city}, ${address.state}, ${address.postalCode}, ${address.country}`,
      amount: priceDetails.payableAmount,
      buyerName: address.name,
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.postalCode,
      country: address.country,
      buyerMobileNo: address.phone,
      quantity:quantity.value
    };

    try {
      const response = await axios.post(
        `${config.apiUrl}/payment/buyNow.`,
        orderDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const newOrderId = response.data.orderId;

alert('Order placed successfully!');
      navigate('/order/payment', {
        state: {
          amount: priceDetails.payableAmount,
          deliveryAddress: address,
          orderId: newOrderId,
          product:{id:product.id},
          quantity:quantity.value
        },
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Failed to place order. Please try again.',
      );
      console.error('Order placement error:', error);
    } finally {
      setLoading(false);
    }
  };

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
              <h2 className="text-2xl font-bold mb-6 ">Order Summary</h2>

              <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white shadow-md rounded-lg overflow-hidden relative hover:shadow-xl transition-shadow duration-300 ease-in-out"
    >
      <div className="flex p-4 space-x-4">
        <Link to={`/product/${product.id}`} className="flex-shrink-0">
          <img
            src={`${config.apiUrl}/B2B/products/${product.image1}`}
            alt={product.name}
            className="w-28 h-28 object-cover rounded-md hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        <div className="flex-grow space-y-2">
          <Link to={`/product/${product.id}`}>
            <h3 className="text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors duration-200">
              {product.name}
            </h3>
          </Link>
          
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                Quantity: <span className="font-medium">{quantity.value}</span>
              </p>
              <p className="text-green-600 font-bold text-xl">
                ₹{product.price.toFixed(2)}
              </p>
            </div>
            
            <div className="text-sm font-semibold bg-orange-100 -mt-20 text-orange-700 px-2 py-1 rounded-full">
              Stock: {product.totalQuantity}
            </div>
          </div>
        </div>
      </div>
    </motion.div>

              {/* Price Breakdown */}
              <div className="mt-6 bg-gray-50 p-4 rounded-lg space-y-2">
  <div className="flex justify-between items-center mb-3">
    <h3 className="text-lg font-semibold text-gray-800">
      Price Details
    </h3>
    <div className="flex items-center space-x-2">
      <label className="text-gray-600 text-sm">Quantity:</label>
      <input
  type="text"
  value={quantity.value}
  onChange={handleQuantityChange}
  onKeyPress={(e) => {
    if (!/^[0-9]+$/.test(e.key)) {
      e.preventDefault();
    }
  }}
  onInput={(e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  }}
  min={product.minQuantity}
  max={product.totalQuantity}
  className="w-20 p-1 border rounded-lg text-center text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
/>

    </div>
  </div>
  {quantity.error && (
    <p className="text-red-500 text-xs -mt-2 mb-2 text-right">
      {quantity.error}
    </p>
  )}
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
    <span>₹{priceDetails.deliveryCharge}</span>
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
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                      }}
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
                      className="mt-1 w-full p-2 border rounded focus:ring-2                      focus:ring-blue-400 focus:border-transparent"
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
                    `Place Order  ₹ ${priceDetails.payableAmount.toFixed(2)} `
                  )}
                </motion.button>

                {/* Terms and Conditions
                <p className="text-xs text-gray-500 text-center mt-4">
                  By placing this order, you agree to our{' '}
                  <button
                    type="button"
                    // onClick={() => navigate('/terms')}
                    className="text-blue-600 hover:underline"
                  >
                    Terms of Service
                  </button>
                  {' '}and{' '}
                  <button
                    type="button"
                    // onClick={() => navigate('/privacy')}
                    className="text-blue-600 hover:underline"
                  >
                    Privacy Policy
                  </button>
                </p> */}
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default OrderProduct;
