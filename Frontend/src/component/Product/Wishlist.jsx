// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaHeart } from 'react-icons/fa';
// import { toast } from 'react-toastify';
// import config from '../../config';
// import { getToken } from '../../utils/JWT_Token';

// const Wishlist = ({ product }) => {
//   const [isWishlisted, setIsWishlisted] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const productId = product.id;
//   const categoryId = product.category.id;
  
//   useEffect(() => {
//     // Check if the product is already in the wishlist when component mounts
//     checkWishlistStatus();
//   }, [productId, categoryId]);

//   const checkWishlistStatus = async () => {
//     try {
//       const user = JSON.parse(localStorage.getItem('buyer'));
//       if (!user) return;

//       const token = getToken();
//       const response = await axios.get(
//         `${config.apiUrl}/B2B/wishlist/getWishListByBuyerId/${user.id}`, 
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // Safely check if the product is in the user's wishlist
//       const wishlistedProduct = Array.isArray(response.data)
//         ? response.data.some(
//             item => item.product && item.product.id === productId
//           )
//         : false;
//         console.log(wishlistedProduct)
//       setIsWishlisted(wishlistedProduct);
//     } catch (error) {
//       console.error('Error checking wishlist status:', error);
      
//       // Additional error handling
//       if (error.response) {
//         // The request was made and the server responded with a status code
//         // that falls out of the range of 2xx
//         console.error('Server error:', error.response.data);
//         console.error('Status code:', error.response.status);
//       } else if (error.request) {
//         // The request was made but no response was received
//         console.error('No response received:', error.request);
//       } else {
//         // Something happened in setting up the request that triggered an Error
//         console.error('Error setting up request:', error.message);
//       }
//     }
//   };

//   const toggleWishlist = async () => {
//     const user = JSON.parse(localStorage.getItem('buyer'));

//     if (!user) {
//       toast.error('Please login to add to wishlist!', {
//         position: 'top-right',
//         autoClose: 2000,
//       });
//       return;
//     }

//     setLoading(true);

//     try {
//       const token = getToken();
//       const wishlistData = {
//         user: { id: user.id },
//         product: { id: productId },
//         category: { id: categoryId },
//         addedDate: new Date().toISOString(),
//       };

//       const endpoint = isWishlisted 
//         ? `${config.apiUrl}/B2B/wishlist/removeFromWishList/${productId}/${user.id}` 
//         : `${config.apiUrl}/B2B/wishlist/addToWishList`;

//       const response = await axios.post(endpoint, wishlistData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//       });

//       if (response.data?.success) {
//         setIsWishlisted(!isWishlisted);
//         toast.success(
//           isWishlisted 
//             ? 'Removed from wishlist' 
//             : 'Added to wishlist', 
//           { 
//             position: 'top-right', 
//             autoClose: 1500 
//           }
//         );
//       }
//     } catch (error) {
//       console.error('Error toggling wishlist:', error);
      
//       // More detailed error logging
//       if (error.response) {
//         console.error('Server error details:', error.response.data);
//         toast.error(`Failed to update wishlist: ${error.response.data?.message || 'Unknown error'}`, {
//           position: 'top-right',
//           autoClose: 2000,
//         });
//       } else if (error.request) {
//         toast.error('No response from server. Please check your connection.', {
//           position: 'top-right',
//           autoClose: 2000,
//         });
//       } else {
//         toast.error('Error updating wishlist', {
//           position: 'top-right',
//           autoClose: 2000,
//         });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <button 
//       onClick={toggleWishlist} 
//       disabled={loading}
//       className={`
//         absolute top-10 right-4 z-10
//         transition-all duration-300 ease-in-out 
//         ${isWishlisted 
//           ? 'text-red-500 hover:text-red-600' 
//           : 'text-gray-300 hover:text-red-400'
//         }
//         focus:outline-none
//         bg-black bg-opacity-50 rounded-full p-2
//       `}
//     >
//       <FaHeart 
//         className={`
//           text-3xl 
//           ${isWishlisted 
//             ? 'animate-pulse' 
//             : 'hover:scale-110'
//           }
//         `} 
//       />
//     </button>
//   );
// };

// export default Wishlist;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import config from '../../config';
import { getToken } from '../../utils/JWT_Token';

const Wishlist = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  const productId = product.id;
  const categoryId = product.category.id;
  
  useEffect(() => {
    // Check if the product is already in the wishlist when component mounts
    checkWishlistStatus();
  }, [productId, categoryId]);

  const checkWishlistStatus = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('buyer'));
      if (!user) return;

      const token = getToken();
      const response = await axios.get(
        `${config.apiUrl}/B2B/wishlist/getWishListByBuyerId/${user.id}`, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Safely check if the product is in the user's wishlist
      const wishlistedProduct = Array.isArray(response.data)
        ? response.data.some(
            item => item.product && item.product.id === productId
          )
        : false;
      
      setIsWishlisted(wishlistedProduct);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      
      // Additional error handling
      if (error.response) {
        console.error('Server error:', error.response.data);
        console.error('Status code:', error.response.status);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
    }
  };

  const toggleWishlist = async () => {
    const user = JSON.parse(localStorage.getItem('buyer'));

    if (!user) {
      toast.error('Please login to add to wishlist!', {
        position: 'top-right',
        autoClose: 2000,
      });
      return;
    }

    setLoading(true);

    try {
      const token = getToken();
      const wishlistData = {
        user: { id: user.id },
        product: { id: productId },
        category: { id: categoryId },
        addedDate: new Date().toISOString(),
      };

      let response;
      if (isWishlisted) {
        // Use DELETE method for removing from wishlist
        response = await axios.delete(
          `${config.apiUrl}/B2B/wishlist/removeFromWishList/${productId}/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Use POST method for adding to wishlist
        response = await axios.post(
          `${config.apiUrl}/B2B/wishlist/addToWishList`, 
          wishlistData, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          }
        );
      }

      // Check if the operation was successful
      if (response.data?.success || response.status === 200) {
        setIsWishlisted(!isWishlisted);
        toast.success(
          isWishlisted 
            ? 'Removed from wishlist' 
            : 'Added to wishlist', 
          { 
            position: 'top-right', 
            autoClose: 1500 
          }
        );
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      
      // More detailed error logging
      if (error.response) {
        console.error('Server error details:', error.response.data);
        toast.error(`Failed to update wishlist: ${error.response.data?.message || 'Unknown error'}`, {
          position: 'top-right',
          autoClose: 2000,
        });
      } else if (error.request) {
        toast.error('No response from server. Please check your connection.', {
          position: 'top-right',
          autoClose: 2000,
        });
      } else {
        toast.error('Error updating wishlist', {
          position: 'top-right',
          autoClose: 2000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={toggleWishlist} 
      disabled={loading}
      className={`
        absolute top-10 mt-12 right-8 z-10
        transition-all duration-300 ease-in-out 
        ${isWishlisted 
          ? 'text-red-500' 
          : 'text-white '
        }
        focus:outline-none
   bg-gray-600 rounded-full p-2
      `}
    >
      <FaHeart 
        className={`
          text-3xl 
          ${isWishlisted 
            ? 'animate-pulse' 
            : 'hover:scale-110'
          }
        `} 
      />
    </button>
  );
};

export default Wishlist;