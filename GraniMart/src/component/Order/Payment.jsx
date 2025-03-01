import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCart } from '../../Context/CartContext';
import { AlertCircle, CheckCircle, CreditCard, Truck, Wallet } from 'lucide-react';
import config from '../../config';
import { getToken } from '../../utils/JWT_Token';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartAmount, deliveryAddress, orderId, amount, product, quantity } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const token = getToken();
  const buyer = JSON.parse(localStorage.getItem('buyer'));
  const { fetchCart } = useCart();

  useEffect(() => {
    if (!amount || !deliveryAddress) {
      toast.error('Missing order information');
      navigate('/buyers/view/cart');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('Razorpay script loaded');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [amount, deliveryAddress, orderId, navigate]);

  const clearCart = () => {
    localStorage.removeItem('cart');
  };

  const handlePayment = async () => {
    setProcessing(true);
    setError('');

    try {
      const orderData = {
        buyerId: buyer.id,
        deliveryAddress: deliveryAddress.street,
        buyerName: deliveryAddress.name,
        buyerMobileNo: deliveryAddress.phone,
        city: deliveryAddress.city,
        state: deliveryAddress.state,
        pincode: deliveryAddress.postalCode,
        street: deliveryAddress.street,
        country: deliveryAddress.country,
        amount,
        product,
        quantity,
        paymentMethod: 'online', // Add payment method
      };

      const response = await axios.post(
        `${config.apiUrl}/payments/proceedToPayment`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const options = {
        key: 'rzp_test_tDyTm24qcfv5o0', // Replace with your Razorpay key
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        name: 'B2B',
        description: 'Purchase Payment',
        order_id: response.data.id, // Razorpay order ID from backend
        handler: function (response) {
          handlePaymentSuccess(response);
        },
        prefill: {
          name: deliveryAddress.name,
          email: buyer.email,
          contact: deliveryAddress.phone,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setError('Failed to process payment. Please try again.');
      toast.error('Payment initialization failed');
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentSuccess = async (response) => {
    try {
      // Verify payment with backend
      const verificationResponse = await axios.post(
        `${config.apiUrl}/payments/verifyPayment`,
        {
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (verificationResponse.data === 'Payment successful and verified.') {
        setOrderSuccess(true);
        clearCart();
        fetchCart();
        toast.success('Payment successful!');
        setTimeout(() => {
          navigate('/buyers/orders');
        }, 2000);
      } else {
        setError('Payment verification failed. Please contact support.');
        toast.error('Payment verification failed');
      }
    } catch (error) {
      setError('Failed to verify payment. Please contact support.');
      toast.error('Payment verification failed');
    }
  };

  const handleCashOnDelivery = async () => {
    setProcessing(true);
    try {
      const orderData = {
        buyerId: buyer.id,
        buyerName: deliveryAddress.name,
        buyerMobileNo: deliveryAddress.phone,
        street: deliveryAddress.street,
        city: deliveryAddress.city,
        state: deliveryAddress.state,
        pincode: deliveryAddress.postalCode,
        country: deliveryAddress.country,
        deliveryAddress: `${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.state}, ${deliveryAddress.postalCode}, ${deliveryAddress.country}`,
        paymentMethod: 'COD', // Specify the payment method as COD
        amount: amount, // Total amount to be paid
        product: product, // Product details (if applicable)
        quantity: quantity, // Quantity of the product (if applicable)
      };

      // Call the proceedToPayment API for COD
      const response = await axios.post(
        `${config.apiUrl}/payments/proceedToPayment`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setOrderSuccess(true);
        clearCart();
        fetchCart();
        toast.success('Order placed successfully with Cash on Delivery!');
        setTimeout(() => {
          navigate('/buyers/orders');
        }, 2000);
      } else {
        setError('Failed to place order. Please try again.');
        toast.error('Order placement failed');
      }
    } catch (error) {
      setError('Failed to place order. Please try again.');
      toast.error('Order placement failed');
      console.error('Error placing order:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Order Successful!
            </h2>
            <p className="text-gray-600 mb-4">
              Thank you for your purchase. You will be redirected to your orders.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 mt-16">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Complete Your Payment</h2>
            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'online'
                      ? 'border-blue-500 bg-blue-50'
                      : 'hover:border-gray-400'
                  }`}
                  onClick={() => setPaymentMethod('online')}
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-6 h-6 text-blue-500" />
                    <div>
                      <h3 className="font-medium">Online Payment</h3>
                      <p className="text-sm text-gray-500">
                        Pay securely with Razorpay
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-blue-500 bg-blue-50'
                      : 'hover:border-gray-400'
                  }`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <div className="flex items-center space-x-3">
                    <Wallet className="w-6 h-6 text-blue-500" />
                    <div>
                      <h3 className="font-medium">Cash on Delivery</h3>
                      <p className="text-sm text-gray-500">
                        Pay when you receive
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium">₹{amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery:</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold">₹{amount}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={
                  paymentMethod === 'online'
                    ? handlePayment
                    : handleCashOnDelivery
                }
                disabled={processing}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 flex items-center justify-center space-x-2"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    {paymentMethod === 'online' ? (
                      <>
                        <CreditCard className="w-5 h-5" />
                        <span>Pay Now</span>
                      </>
                    ) : (
                      <>
                        <Truck className="w-5 h-5" />
                        <span>Place Order</span>
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;