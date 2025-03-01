 

    import React, { useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { toast } from 'react-toastify';
    import { ToastContainer } from 'react-toastify';
    import 'react-toastify/dist/ReactToastify.css';
    import {
      FaTrash,
      FaMinus,
      FaPlus,
      FaShoppingCart,
      FaArrowLeft,
    } from 'react-icons/fa';
    import config from '../../config';
    import { useCart } from '../../Context/CartContext';

    const ViewMyCart = () => {
      const navigate = useNavigate();
      const { carts, cartAmount, loading, fetchCart, updateCart, deleteCart } = useCart();

      useEffect(() => {
        fetchCart();
      }, [fetchCart]);

      const checkout = () => {
        if (!carts.length) {
          toast.error('No Products In Cart To Order!!!');
          return;
        }
        navigate('/cart/checkout', { state: { carts, cartAmount } });
      };

      const calculateOrderSummary = () => {
        const subtotal = carts.reduce(
          (total, cart) => total + cart.productPrice * cart.productQuantity,
          0,
        );

        const total = parseFloat(cartAmount);
        const discounts = (subtotal * 0.10);


        return {
          subtotal: subtotal.toFixed(2),
          discounts: discounts.toFixed(2),
          total: total.toFixed(2),
        };
      };

      const handleQuantityUpdate = async (cart, increment) => {
        if (!increment && cart.productQuantity <= 1) {
          // If trying to decrease quantity below 1, show delete confirmation
          if (window.confirm('Do you want to remove this item from cart?')) {
            await deleteCart(cart.id);
          }
          return;
        }
        await updateCart(cart, increment);
      };

      if (loading) {
        return (
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        );
      }

      const { subtotal, discounts, total } = calculateOrderSummary();

      return (
        <div className="bg-gray-100 min-h-screen py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
              <FaShoppingCart className="inline-block mr-2 mb-1" />
              Your Shopping Cart
            </h1>
            {carts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-xl text-gray-600 mb-4">Your cart is empty.</p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 inline-flex items-center"
                >
                  <FaArrowLeft className="mr-2" /> Continue Shopping
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  {carts.map(cart => (
                    <div
                      key={cart.id}
                      className="bg-white rounded-lg shadow-md p-6 mb-4 relative"
                    >
                      <div className="flex flex-col md:flex-row items-center">
                        <img
                          src={`${config.apiUrl}/api/products/media/${cart.product.image1}`}
                          alt={cart.product.name}
                          className="w-32 h-32 object-cover rounded-md mb-4 md:mb-0 md:mr-6 cursor-pointer"
                          onClick={() =>
                            navigate(`/product/${cart.product.id}`, {
                              state: { product: cart.product },
                            })
                          }
                        />
                        <div className="flex-grow">
                          <h2 className="text-xl font-semibold text-gray-800">
                            {cart.product.productName}
                          </h2>
                          <p className="text-gray-600">
                            {cart.product.category?.categoryName || 'Not Available'}
                          </p>
                          <p className="text-lg font-bold text-blue-600 mt-2">
                            &#8377; {cart.productPrice}
                          </p>
                        </div>
                        <div className="flex flex-col items-center mt-4 md:mt-0">
                          <div className="flex items-center mb-2">
                            <button
                              onClick={() => handleQuantityUpdate(cart, false)}
                              className="bg-gray-200 text-gray-600 p-2 rounded-full hover:bg-gray-300 transition duration-300"
                            >
                              <FaMinus size={12} />
                            </button>
                            <span className="mx-3 font-medium">
                              {cart.productQuantity}
                            </span>
                            <button
                              onClick={() => handleQuantityUpdate(cart, true)}
                              className="bg-gray-200 text-gray-600 p-2 rounded-full hover:bg-gray-300 transition duration-300"
                            >
                              <FaPlus size={12} />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteCart(cart.id)}
                          className="absolute top-4 right-4 text-red-600 hover:text-red-800 transition duration-300"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                    <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                    <div className="flex justify-between mb-2">
                      <span>Subtotal</span>
                      <span>&#8377; {subtotal}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Discounts(10%)</span>
                      <span>&#8377; {discounts}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <hr className="my-4" />
                    <div className="flex justify-between mb-4">
                      <span className="font-bold">Total</span>
                      <span className="font-bold">&#8377; {subtotal-discounts}</span>
                    </div>
                    <button
                      onClick={checkout}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-full transition duration-300 mb-4"
                    >
                      Proceed to Checkout
                    </button>
                    <button
                      onClick={() => navigate('/')}
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-full transition duration-300 flex items-center justify-center"
                    >
                      <FaArrowLeft className="mr-2" /> Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <ToastContainer />
        </div>
      );
    };

    export default ViewMyCart;