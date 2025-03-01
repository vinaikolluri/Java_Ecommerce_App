// import React, {
//   createContext,
//   useContext,
//   useState,
//   useCallback,
//   useEffect,
// } from 'react';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import config from '../config';
// import { getToken } from '../utils/JWT_Token';

// const CartContext = createContext();

// export const useCart = () => useContext(CartContext);

// export const CartProvider = ({ children }) => {
//   const [carts, setCarts] = useState([]);
//   const [cartAmount, setCartAmount] = useState('0.0');
//   const [loading, setLoading] = useState(true);
//   const [cartItemCount, setCartItemCount] = useState(0);
//   const userId = JSON.parse(localStorage.getItem('buyer'))?.id;

//   const fetchCart = useCallback(async () => {
//     setLoading(true);
//     if (!userId) {
//       setLoading(false);
//       return;
//     }
//     try {
//       const token = getToken();
//       if (!token) throw new Error('Authentication token not found.');

//       const response = await axios.get(
//         `${config.apiUrl}/api/cart/findCartByBuyerId/${userId}`,
//         { headers: { Authorization: `Bearer ${token}` } },
//       );
//       const allCart = response.data;
//       if (Array.isArray(allCart)) {
//         const totalAmount = allCart.reduce(
//           (sum, item) => sum + (item.totalPrice || 0),
//           0,
//         );
//         setCarts(allCart || []);
//         setCartAmount(totalAmount || '0.0');
//         setCartItemCount(allCart.length || 0);
//       } else {
//         // Explicitly set to empty if no cart data
//         setCarts([]);
//         setCartAmount('0.0');
//         setCartItemCount(0);
//       }
//     } catch (error) {
//       console.error('Error fetching cart:', error);
//       // Only show error toast if there's a real error, not just empty cart
//       setCarts([]);
//       setCartAmount('0.0');
//       setCartItemCount(0);
//     } finally {
//       setLoading(false);
//     }
//   }, [userId]);

//   useEffect(() => {
//     fetchCart();
//   }, [fetchCart]);

//   const updateCart = useCallback(
//     async (cart, increment = true) => {
//       const token = getToken();
//       if (!token) {
//         toast.error('Authentication token not found. Please login again.');
//         return;
//       }

//       const newQuantity = increment
//         ? cart.productQuantity + 1
//         : Math.max(1, cart.productQuantity - 1);

//       try {
//         const response = await axios({
//           method: 'PUT',
//           url: `${config.apiUrl}/api/cart/updateCart/${cart.id}?quantity=${newQuantity}`,
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (response.data.success) {
//           toast.success(response.data.responseMessage);
//           await fetchCart(); // This will update all cart state at once
//         } else {
//           toast.error(response.data.responseMessage);
//         }
//       } catch (error) {
//         console.error('Error updating cart:', error);
//         // toast.error('Failed to update cart. Please try again.');
//       }
//     },
//     [userId, fetchCart],
//   );

//   const deleteCart = useCallback(
//     async cartId => {
//       const token = getToken();
//       if (!token) {
//         toast.error('Authentication token not found. Please login again.');
//         return;
//       }

//       try {
//         const response = await axios({
//           method: 'DELETE',
//           url: `${config.apiUrl}/api/cart/deleteCartItem/${cartId}`,

//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (response.data.success) {
//           toast.success(response.data.responseMessage);
//           // Update local state first for immediate feedback
//           setCarts(prevCarts => {
//             const newCarts = prevCarts.filter(cart => cart.id !== cartId);
//             setCartItemCount(newCarts.length);
//             return newCarts;
//           });
//           setCartAmount(response.data.totalCartAmount || '0.0');
//           await fetchCart();
//         } else {
//           toast.error(response.data.responseMessage);
//         }
//       } catch (error) {
//         console.error('Error deleting cart item:', error);
//         toast.error('Failed to delete cart item. Please try again.');
//       }
//     },
//     [userId, fetchCart],
//   );

//   // Remove the separate updateCartCount function since we handle count in fetchCart

//   const value = {
//     carts,
//     cartAmount,
//     cartItemCount,
//     loading,
//     fetchCart,
//     updateCart,
//     deleteCart,
//   };

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// };


import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import config from '../config';
import { getToken } from '../utils/JWT_Token';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [carts, setCarts] = useState([]);
  const [cartAmount, setCartAmount] = useState('0.0');
  const [loading, setLoading] = useState(true);
  const [cartItemCount, setCartItemCount] = useState(0);
  const userId = JSON.parse(localStorage.getItem('buyer'))?.id;

  const fetchCart = useCallback(async () => {
    setLoading(true);
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const token = getToken();
      if (!token) throw new Error('Authentication token not found.');

      const response = await axios.get(
        `${config.apiUrl}/api/cart/findCartByBuyerId/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const allCart = response.data;
      if (Array.isArray(allCart)) {
        const totalAmount = allCart.reduce(
          (sum, item) => sum + (item.totalPrice || 0),
          0,
        );
        setCarts(allCart);
        setCartAmount(totalAmount.toString());
        setCartItemCount(allCart.length);
      } else {
        setCarts([]);
        setCartAmount('0.0');
        setCartItemCount(0);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCarts([]);
      setCartAmount('0.0');
      setCartItemCount(0);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateCart = useCallback(
    async (cart, increment = true) => {
      const token = getToken();
      if (!token) {
        toast.error('Authentication token not found. Please login again.');
        return;
      }

      const newQuantity = increment
        ? cart.productQuantity + 1
        : Math.max(1, cart.productQuantity - 1);

      try {
        // Update local state optimistically
        setCarts(prevCarts =>
          prevCarts.map(item =>
            item.id === cart.id
              ? {
                  ...item,
                  productQuantity: newQuantity,
                  totalPrice: (newQuantity * item.productPrice).toFixed(2),
                }
              : item,
          ),
        );

        const response = await axios({
          method: 'PUT',
          url: `${config.apiUrl}/api/cart/updateCart/${cart.id}?quantity=${newQuantity}`,
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          // Update cart amount after successful API call
          setCartAmount(response.data.totalCartAmount || cartAmount);
          toast.success(response.data.responseMessage);
        } else {
          // Revert local state if API call fails
          await fetchCart();
          toast.error(response.data.responseMessage);
        }
      } catch (error) {
        console.error('Error updating cart:', error);
        await fetchCart(); // Revert to server state on error
        toast.error('Failed to update cart. Please try again.');
      }
    },
    [cartAmount, fetchCart],
  );

  const deleteCart = useCallback(
    async cartId => {
      const token = getToken();
      if (!token) {
        toast.error('Authentication token not found. Please login again.');
        return;
      }

      try {
        // Update local state optimistically
        const updatedCarts = carts.filter(cart => cart.id !== cartId);
        setCarts(updatedCarts);
        setCartItemCount(updatedCarts.length);

        const response = await axios({
          method: 'DELETE',
          url: `${config.apiUrl}/api/cart/deleteCartItem/${cartId}`,
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setCartAmount(response.data.totalCartAmount || '0.0');
          toast.success(response.data.responseMessage);
        } else {
          // Revert local state if API call fails
          await fetchCart();
          toast.error(response.data.responseMessage);
        }
      } catch (error) {
        console.error('Error deleting cart item:', error);
        await fetchCart(); // Revert to server state on error
        toast.error('Failed to delete cart item. Please try again.');
      }
    },
    [carts, fetchCart],
  );

  const value = {
    carts,
    cartAmount,
    cartItemCount,
    loading,
    fetchCart,
    updateCart,
    deleteCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};