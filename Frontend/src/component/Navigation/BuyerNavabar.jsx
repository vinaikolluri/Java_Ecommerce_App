
// import React, { useState, useRef, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import {
//   FaShoppingCart,
//   FaUserCircle,
//   FaSignOutAlt,
//   FaClipboardList,
//   FaBars,
// } from 'react-icons/fa';
// import { useAuth } from '../../Context/AuthContext';
// import { useCart } from '../../Context/CartContext';
// import { clearToken } from '../../utils/JWT_Token';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // BuyerNavbar.jsx
// const BuyerNavbar = ({ onClose }) => {
//   const [profileOpen, setProfileOpen] = useState(false);
//   const { setIsAuthenticated } = useAuth();
//   const { cartItemCount } = useCart();
//   const navigate = useNavigate();
//   const profileDropdownRef = useRef(null);

//   const toggleProfileDropdown = () => {
//     setProfileOpen(!profileOpen);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
//         setProfileOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     clearToken();
//     setIsAuthenticated(false);
//     navigate('/');
//     toast.success('Logged out successfully!', {
//       position: 'top-center',
//       autoClose: 2000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//     });
//   };

//   return (
//     <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 p-4 md:p-0">
//       <div className="relative">
//         <Link
//           to="/buyers/view/cart"
//           onClick={onClose}
//           className="text-white text-lg flex items-center gap-2 hover:text-red-400 transition-colors"
//         >
//           <FaShoppingCart className="text-2xl" />
//           {cartItemCount > 0 && (
//             <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
//               {cartItemCount}
//             </span>
//           )}
//           Cart
//         </Link>
//       </div>
      
//       <Link
//         to="/buyers/orders"
//         onClick={onClose}
//         className="text-white text-lg flex items-center gap-2 hover:text-red-400 transition-colors"
//       >
//         <FaClipboardList className="text-2xl" /> Orders
//       </Link>

//       <div className="relative" ref={profileDropdownRef}>
//         <button
//           onClick={toggleProfileDropdown}
//           className="flex items-center text-white text-lg hover:text-red-400 transition-colors focus:outline-none"
//         >
//           <FaUserCircle className="text-2xl mr-2" /> Buyer
//         </button>
        
//         {profileOpen && (
//           <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-2 z-50">
//             <Link
//               to="/profile"
//               className="block px-4 py-2 text-white hover:bg-gray-700 hover:text-red-400 transition-colors"
//               onClick={() => {
//                 onClose();
//                 setProfileOpen(false);
//               }}
//             >
//               <FaUserCircle className="inline mr-2" /> Profile
//             </Link>
//             <button
//               onClick={handleLogout}
//               className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 hover:text-red-400 transition-colors focus:outline-none"
//             >
//               <FaSignOutAlt className="inline mr-2" /> Logout
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BuyerNavbar ;






import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaShoppingCart,
  FaUserCircle,
  FaSignOutAlt,
  FaClipboardList,
  FaCog,
  FaChevronDown
} from 'react-icons/fa';
import { useAuth } from '../../Context/AuthContext';
import { useCart } from '../../Context/CartContext';
import { clearToken } from '../../utils/JWT_Token';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BuyerNavbar = ({ onClose }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const { setIsAuthenticated } = useAuth();
  const { cartItemCount } = useCart();
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);

  const toggleProfileDropdown = () => {
    setProfileOpen(!profileOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Add a delay before showing cart count to ensure proper loading
  const [showCartCount, setShowCartCount] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCartCount(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    clearToken();
    setIsAuthenticated(false);
    navigate('/');
    toast.success('Logged out successfully!', {
      position: 'top-center',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 p-4 md:p-0">
      <div className="relative">
        <Link
          to="/buyers/view/cart"
          onClick={onClose}
          className="text-white text-lg flex items-center gap-2 hover:text-red-400 transition-colors duration-200 relative"
        >
          <div className="relative">
            <FaShoppingCart className="text-2xl" />
            {showCartCount && cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold animate-fade-in">
                {cartItemCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </Link>
      </div>
      
      <Link
        to="/buyers/orders"
        onClick={onClose}
        className="text-white text-lg flex items-center gap-2 hover:text-red-400 transition-colors duration-200"
      >
        <FaClipboardList className="text-2xl" />
        <span>Orders</span>
      </Link>

      <div className="relative" ref={profileDropdownRef}>
        <button
          onClick={toggleProfileDropdown}
          className="flex items-center text-white text-lg hover:text-red-400 transition-colors duration-200 focus:outline-none gap-2 p-2 rounded-lg hover:bg-gray-700/50"
        >
          <FaUserCircle className="text-2xl" />
          <span>Buyer</span>
          <FaChevronDown className={`text-sm transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {profileOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-700 transform origin-top-right transition-all duration-200 ease-out">
            <div className="px-4 py-2 border-b border-gray-700">
              <p className="text-sm text-gray-400">Signed in as</p>
              <p className="text-white font-medium">Buyer Account</p>
            </div>
            
            <Link
              to="/profile"
              className="flex items-center px-4 py-3 text-white hover:bg-gray-700 hover:text-red-400 transition-colors duration-200 gap-3"
              onClick={() => {
                onClose();
                setProfileOpen(false);
              }}
            >
              <FaUserCircle className="text-lg" />
              <span>View Profile</span>
            </Link>
            
            <Link
              to="/settings"
              className="flex items-center px-4 py-3 text-white hover:bg-gray-700 hover:text-red-400 transition-colors duration-200 gap-3"
              onClick={() => {
                onClose();
                setProfileOpen(false);
              }}
            >
              <FaCog className="text-lg" />
              <span>Settings</span>
            </Link>
            
            <div className="border-t border-gray-700 mt-2">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-white hover:bg-gray-700 hover:text-red-400 transition-colors duration-200 gap-3"
              >
                <FaSignOutAlt className="text-lg" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerNavbar;