// import React, { useState, useRef, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
// import { useAuth } from '../../Context/AuthContext';
// import { clearToken } from '../../utils/JWT_Token';

// const SellerNavbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);
//   const { setIsAuthenticated } = useAuth();
//   const navigate = useNavigate();
//   const navbarRef = useRef(null);

//   const toggleNavbar = () => {
//     setIsOpen(prev => !prev);
//   };

//   const toggleProfileDropdown = () => {
//     setProfileOpen(!profileOpen);
//   };

//   const closeNavbar = () => {
//     setIsOpen(false);
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     clearToken();
//     setIsAuthenticated(false);
//     navigate('/');
//   };

//   const handleClickOutside = event => {
//     if (navbarRef.current && !navbarRef.current.contains(event.target)) {
//       closeNavbar();
//       setProfileOpen(false); // Close profile dropdown if clicked outside
//     }
//   };

//   useEffect(() => {
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   return (
//     <nav
//       className="h-16 flex justify-between items-center bg-gray-800 p-4 relative z-10"
//       ref={navbarRef}
//     >
//       <div
//         className={`flex flex-col md:flex-row md:items-center ${
//           isOpen ? 'block' : 'hidden'
//         } md:flex md:space-x-6 absolute md:relative top-16 md:top-auto left-0 w-full md:w-auto bg-gray-800 md:bg-transparent text-center md:text-left`}
//       >
//         <Link
//           to="/sellers/all/category"
//           onClick={closeNavbar}
//           className="text-white text-lg flex items-center gap-2 px-4 py-2 md:p-0 hover:text-red-400"
//         >
//           All Category
//         </Link>
//         <Link
//           to="/sellers/add/category"
//           onClick={closeNavbar}
//           className="text-white text-lg flex items-center gap-2 px-4 py-2 md:p-0 hover:text-red-400"
//         >
//           Add Category
//         </Link>
//         <Link
//           to="/sellers/add/product"
//           onClick={closeNavbar}
//           className="text-white text-lg flex items-center gap-2 px-4 py-2 md:p-0 hover:text-red-400"
//         >
//           Add Product
//         </Link>
//         <div className="relative">
//           <button
//             onClick={toggleProfileDropdown}
//             className="flex items-center text-white text-lg px-4 py-2 md:p-0 hover:text-red-400 focus:outline-none"
//           >
//             <FaUserCircle className="text-2xl mr-2" /> Seller
//           </button>
//           {profileOpen && (
//             <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-2 z-10">
//               <Link
//                 to="/profile"
//                 className="block px-4 py-2 text-white hover:bg-gray-700 hover:text-red-400"
//                 onClick={closeNavbar}
//               >
//                 <FaUserCircle className="inline mr-2" /> Profile
//               </Link>
//               <button
//                 onClick={handleLogout}
//                 className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 hover:text-red-400 focus:outline-none"
//               >
//                 <FaSignOutAlt className="inline mr-2" /> Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default SellerNavbar;




import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../Context/AuthContext';
import { clearToken } from '../../utils/JWT_Token';


// SellerNavbar.jsx
const SellerNavbar = ({ onClose }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const { setIsAuthenticated } = useAuth();
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

  const handleLogout = () => {
    localStorage.clear();
    clearToken();
    setIsAuthenticated(false);
    navigate('/');
    toast.success('Logged out successfully!', {
      position: 'top-center',
      autoClose: 2000,
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 p-4 md:p-0">
      <Link
        to="/sellers/all/category"
        onClick={onClose}
        className="text-white text-lg hover:text-red-400 transition-colors"
      >
        All Category
      </Link>
      
      <Link
        to="/sellers/add/category"
        onClick={onClose}
        className="text-white text-lg hover:text-red-400 transition-colors"
      >
        Add Category
      </Link>
      
      <Link
        to="/sellers/add/product"
        onClick={onClose}
        className="text-white text-lg hover:text-red-400 transition-colors"
      >
        Add Product
      </Link>

      <div className="relative" ref={profileDropdownRef}>
        <button
          onClick={toggleProfileDropdown}
          className="flex items-center text-white text-lg hover:text-red-400 transition-colors focus:outline-none"
        >
          <FaUserCircle className="text-2xl mr-2" /> Seller
        </button>
        
        {profileOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-2 z-50">
            <Link
              to="/profile"
              className="block px-4 py-2 text-white hover:bg-gray-700 hover:text-red-400 transition-colors"
              onClick={() => {
                onClose();
                setProfileOpen(false);
              }}
            >
              <FaUserCircle className="inline mr-2" /> Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 hover:text-red-400 transition-colors focus:outline-none"
            >
              <FaSignOutAlt className="inline mr-2" /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default SellerNavbar;